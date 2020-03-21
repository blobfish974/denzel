/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const fs = require('fs'); //to export data
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 77;

module.exports =async function start (actor = DENZEL_IMDB_ID, metascore = METASCORE) {
  try {
    console.log(`📽️  fetching filmography of ${actor}...`);
    const movies = await imdb(actor);
    const awesome = movies.filter(movie => movie.metascore >= metascore);

    console.log(`🍿 ${movies.length} movies found.`);
    //console.log(JSON.stringify(movies, null, 2));
    /*
    // export in JSON
    fs.writeFileSync('../data/movies.json', JSON.stringify(movies,null,2), (err) => {
        if (err) throw err;
        console.log('Data (movies) written to file');
    });*/
    console.log(`🥇 ${awesome.length} awesome movies found.`);
    // console.log(JSON.stringify(awesome, null, 2));
    /*
    // export in JSON
    fs.writeFileSync('../data/awesome.json', JSON.stringify(awesome,null,2), (err) => {
        if (err) throw err;
        console.log('Data (awesome movies) written to file');
    });*/
    return{movies,awesome};
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  
}

const [, , id, metascore] = process.argv;

// start(id, metascore);

// exports.start=start

