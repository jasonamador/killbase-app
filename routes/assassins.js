const express = require('express');
const config = require('../knexfile')['development'];
const knex = require('knex')(config);
const router = express.Router();

router.get('/', (req, res) => {
  knex('assassins').select('assassins.id', 'people.name', 'assassins.weapon', 'assassins.contact_info as contactInfo', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age')
    .leftJoin('people', 'assassins.person_id', 'people.id')
    .then((assassins) => {
      knex('code_names').select().then((codeNamesDb) => {
        let codeNames = {};
        codeNamesDb.forEach((codeName) => {
          if (!codeNames[codeName.assassin_id]) {
            codeNames[codeName.assassin_id] = [];
          }
          codeNames[codeName.assassin_id].push(codeName.code_name);
        });
        assassins.forEach((assassin) => {
          if (codeNames[assassin.id]) {
            assassin.codeNames = codeNames[assassin.id];
          } else {
            assassin.codeNames = [];
          }
        });
        res.send(assassins);
      });
    });
  });

router.get('/:id', (req, res) => {
  knex('assassins').select('assassins.id', 'people.name', 'assassins.weapon', 'assassins.contact_info as contactInfo', 'assassins.price', 'assassins.rating', 'assassins.kills', 'assassins.age')
    .leftJoin('people', 'assassins.person_id', 'people.id')
    .where('assassins.id', req.params.id)
    .then((assassins) => {
      knex('code_names').select().then((codeNamesDb) => {
        let codeNames = {};
        codeNamesDb.forEach((codeName) => {
          if (!codeNames[codeName.assassin_id]) {
            codeNames[codeName.assassin_id] = [];
          }
          codeNames[codeName.assassin_id].push(codeName.code_name);
        });
        assassins.forEach((assassin) => {
          if (codeNames[assassin.id]) {
            assassin.codeNames = codeNames[assassin.id];
          } else {
            assassin.codeNames = [];
          }
        });
        res.send(assassins);
      });
    });
  });

module.exports = router;
