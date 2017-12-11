exports.seed = function(knex, Promise) {
  const fs = require('fs');

  // get targets from contracts file
  let contractsCsv = fs.readFileSync('./data/contracts.csv', 'UTF-8');

  // clean it
  let contracts = contractsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
  contracts.shift(1);

  let peopleNamesToIds = {};
  let peopleIdsToNames = {};
  let clientNamesToIds = {};
  let targetNamesToIds = {};

  return knex('people')
    .select()
    .then((people) => {
      people.forEach((person) => {
        peopleIdsToNames[person.id] = person.name;
        peopleNamesToIds[person.name] = person.id;
      });
      return knex('clients').select();
    })
    .then((clients) => {
      clients.forEach((client) => {
        clientNamesToIds[peopleIdsToNames[client.person_id]] = client.id;
      })
      return knex('targets').select();
    })
    .then((targets) => {
      targets.forEach((target) => {
        targetNamesToIds[peopleIdsToNames[target.person_id]] = target.id;
      });
      return knex('contracts').insert(contracts.map((c) => {
        return {
          target_id: targetNamesToIds[c[0]],
          client_id: clientNamesToIds[c[4]],
          budget: c[5],
          complete: false
        };
      }));
    });
  };
