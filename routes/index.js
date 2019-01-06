var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const neo4j = require('neo4j-driver').v1;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

// const USER = process.env.USER;
// const PASSWORD = process.env.PASSWORD;

const USER = 'neo4j';
const PASSWORD = 'topsecret123';

const driver = neo4j.driver(
  'bolt://localhost',
  neo4j.auth.basic(USER, PASSWORD)
);
const session = driver.session();

router.get('/', function(req, res, next) {
  const resultPromise = session.run(
    "MATCH (a:Terminal {name:'Uyo'}), (d:Terminal {name:'Yenagoa'}) MATCH route = allShortestPaths((a)-[:STOPS_AT*]-(d)) RETURN route"
  );

  resultPromise.then(result => {
    session.close();

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    // console.log(node.properties.name);
    console.log(result);

    // on application exit:
    driver.close();

    res.status(200).json(result);
  });
});

module.exports = router;
