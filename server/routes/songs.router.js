const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
    database: 'music_library', // the name of the database
    host: 'localhost', // where our database is
    port: 5432, // the port for your db; 5432 is default for postgres
    max: 10, //how many connections (queries) at one time
    idleTimeoutMillis: 30000 //30 seconds to try to connect, then cancel query
});

//is not required, but is useful for debugging
pool.on('connect', () => {
    console.log('Postgresql is connected!');
    
})

//the pool will emit an error on behalf of any idle clients
pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
    
})

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

router.get('/', (req, res) => {
    // res.send(songs);
    // check SQL query text in Postico first
    let queryText = 'SELECT * FROM "songs";';
    pool.query(queryText)
    .then((result)=> {
    res.send(result.rows);
    }).catch((err)=> {
    console.log('Error making query', queryText, err);
    res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
    songs.push(req.body);
    res.sendStatus(200);
});



module.exports = router;