exports.seed = function(knex, Promise) {
  const fs = require('fs');

  // get the assassins file
  let assassinsCsv = fs.readFileSync('./data/assassins.csv', 'UTF-8');
  let assassins = assassinsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));

  let peopleNamesToIds = {}; // lookup for people names to ids
  let assassinsObjs = [];
  let names = []; // to easily track the names used so far

  return knex('people').select()
    .then((result) => {
      result.forEach((e) => {
        peopleNamesToIds[e.name] = e.id;
      });
      for (let i = 1; i < assassins.length; i++) {
        if (!names.includes(assassins[i][0])) {
          names.push(assassins[i][0]);
          assassinsObjs.push({
            person_id: peopleNamesToIds[assassins[i][0]],
            weapon: assassins[i][2],
            email: assassins[i][3],
            age: assassins[i][4],
            price: assassins[i][5],
            rating: assassins[i][6],
            kills: assassins[i][7],
          });
        }
      }
    })
    .then(() => {
      return knex('assassins').del();
    })
    .then(() => {
      return knex.schema.raw('ALTER SEQUENCE assassins_id_seq RESTART');
    })
    .then(() => {
      return knex('assassins').insert(assassinsObjs);
    })
    .then(() => {
      return knex.raw(`UPDATE assassins SET hashed_id = ENCODE(DIGEST(assassins.id::text, 'sha1'), 'hex') FROM assassins b WHERE assassins.id = b.id`);
    });
};
