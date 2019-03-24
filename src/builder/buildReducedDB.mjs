import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const inputFile = path.join(__dirname, '..', 'assets', 'data', 'full.db');
const outputFile = path.join(__dirname, '..', 'assets', 'data', 'movies.json');

let input = JSON.parse(fs.readFileSync(inputFile).toString());;
const output = input.map(movie => ({
  id: movie.id,
  imdbid: movie.imdbid,
  year: movie.year,
  rating: movie.rating,
  imdbData: {
    genres: movie.imdbData.genres,
    production_countries: movie.imdbData.production_countries.map(country => ({ iso_3166_1: country.iso_3166_1 })),
    vote_average: movie.imdbData.vote_average,
  },
  omdbData: {
    imdbRating: (movie.omdbData || {}).imdbRating || 0
  },
  persons: {
    Director: (movie.persons.Director || []).map((person) => ({ gender: person.gender })) ,
    Screenplay: (movie.persons.Screenplay || []).map((person) => ({ gender: person.gender })),
    'Executive Producer': (movie.persons['Executive Producer'] || []).map((person) => ({ gender: person.gender })) || [],
  },
}));

fs.writeFileSync(outputFile, JSON.stringify(output));

