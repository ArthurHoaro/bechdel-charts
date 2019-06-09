import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sleep from 'system-sleep';
import Config from '../../config';

const dirname = path.dirname(new URL(import.meta.url).pathname);

const bechdel = axios.create({
  baseURL: 'https://bechdeltest.com/api/v1/',
  headers: {
    ContentType: 'application/json;charset=utf-8',
  },
});

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: Config.TMDB_KEY,
  },
  headers: {
    ContentType: 'application/json;charset=utf-8',
  },
});

const omdb = axios.create({
  baseURL: 'https://www.omdbapi.com/',
  params: {
    apikey: Config.OMDB_KEY,
  },
  headers: {
    ContentType: 'application/json;charset=utf-8',
  },
});

const keepJobs = [
  'Director',
  'Screenplay',
  'Executive Producer',
];
const output = path.join(dirname, '..', 'assets', 'data', 'full.db');

let fullDB = [];
if (fs.existsSync(output)) {
  // prevent file corruption
  if (fs.statSync(output).size) {
    fs.copyFileSync(output, `${output}.sav`);
  }
  fullDB = JSON.parse(fs.readFileSync(output).toString());
}

/**
 * First we download the full DB to get new movies
 * and update existing ratings.
 */
let allBechdel = [];
const newMovies = [];
bechdel.get('/getAllMovies')
.then((response) => {
  allBechdel = response.data;
  Promise.resolve();
})
.then(() => {
  // lil performance trick
  const mapDB = new Map();
  fullDB.forEach((movie, index) => {
    mapDB.set(parseInt(movie.id), index);
  });
  allBechdel.forEach((movie) => {
    const id = parseInt(movie.id);
    if (!mapDB.has(id)) {
      newMovies.push(movie);
      return;
    }

    // Update rating if necessary
    if (fullDB[mapDB.get(id)].rating !== movie.rating) {
      fullDB[mapDB.get(id)].rating = movie.rating;
    }
  });
  Promise.resolve();
})
.then(() => {
  const total = allBechdel.length;
  let i = total - newMovies.length;

  newMovies.forEach((input) => {
    const movie = input;
    console.log(`[${i += 1} / ${total}] Processing movie #${movie.imdbid}: ${movie.title}`);
    let goNext = false;
    tmdb.get(
      `/movie/tt${movie.imdbid}`,
      {
        params: {
          append_to_response: 'credits',
        },
      },
    )
    .then((tmdbData) => {
      movie.persons = {};
      tmdbData.data.credits.crew.forEach((person) => {
        if (keepJobs.includes(person.job)) {
          if (!(person.job in movie.persons)) {
            movie.persons[person.job] = [];
          }
          movie.persons[person.job].push(person);
        }
      });
      movie.imdbData = tmdbData.data;
      console.log(`[${i} / ${total}] IMDB Metadata retrieved #${tmdbData.data.id}: ${tmdbData.data.title} [${tmdbData.data.genres.map((g => g.name)).join(', ')}]`);

      return omdb.get('/', { params: { i: `tt${movie.imdbid}` } })
      .then((omdbData) => {
        movie.omdbData = omdbData.data;
        console.log(`[${i} / ${total}] OMDB Metadata retrieved #${omdbData.data.imdbID}: ${omdbData.data.Title} [${omdbData.data.imdbRating}]`);

        fullDB.push(movie);
        if (i % 10 === 0) {
          console.log('Writing database...');
          fs.writeFileSync(output, JSON.stringify(fullDB));
        }
        console.log(`[${i} / ${total}] Current limit: ${tmdbData.headers['x-ratelimit-remaining']}`);
        if (parseInt(tmdbData.headers['x-ratelimit-remaining']) === 0) {
          while (Date.now() <= tmdbData.headers['x-ratelimit-reset']) {
            sleep(1000);
          }
        }
        Promise.resolve();
      });
    })
    .then(() => { goNext = true; })
    .catch((error) => {
      console.log(error);
      goNext = true;
    });
    while (!goNext) {
      sleep(1000);
    }
    // process.exit(1);
  });

  console.log('Writing database...');
  fs.writeFileSync(output, JSON.stringify(fullDB));
});
