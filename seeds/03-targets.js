exports.seed = function(knex, Promise) {
  const fs = require('fs');

  // get targets from contracts file
  let contractsCsv = fs.readFileSync('./data/contracts.csv', 'UTF-8');

  // clean it
  let contracts = contractsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
  contracts.shift(1);

  let peopleNamesToIds = {};

  return knex('people')
    .select()
    .then((result) => {
      result.forEach((e) => {
        peopleNamesToIds[e.name] = e.id;
      });

      let targets = [];
      for (let i = 0; i < contracts.length; i++) {
        let target = {};
        target['person_id'] = peopleNamesToIds[contracts[i][0]];
        target['location'] = contracts[i][1];
        target['photo_url'] = contracts[i][2];
        target['security'] = contracts[i][3];
        targets.push(target);
      }

      return knex('targets').insert(targets);
    })
  };
