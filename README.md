# Bechdel Test Statistics

 Source code of [bechdel.hoa.ro](https://bechdel.hoa.ro).

## Data sources

  * [bechdeltest.com](https://bechdeltest.com/)
  * [themoviedb.org](https://www.themoviedb.org)
  * [omdbapi.com](https://www.omdbapi.com/)

## Development

This project is built with [VueJS](https://vuejs.org/), 
[amChart](https://www.amcharts.com/) 
and [Bootstrap](https://getbootstrap.com/).

### How to

In order to make it running, you need to build your movie database.

  1. Configure TMDB and OMDB API keys in `config.js` (copy the dist file from `config.js.dist`).
  2. `yarn install`
  3. Run `update.sh`, it'll build a full JSON DB in `src/assets/data` and a lighter version for
  statistics usage.

### Run

In development mode, just run `yarn run serve`.

You can also build and run the provided [Docker image](https://hub.docker.com/r/arthurhoaro/bechdel),
which includes a CRON task updating the data once a day.

## License

[MIT](https://github.com/ArthurHoaro/bechdel-charts/blob/master/LICENSE.md)

