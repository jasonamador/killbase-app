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

      let clients = [];
      for (let i = 0; i < contracts.length; i++) {
        let client = {};
        client['person_id'] = peopleNamesToIds[contracts[i][4]];
        clients.push(client);
      }

      return knex('clients').del()
      .then(() => knex.schema.raw('alter sequence clients_id_seq restart'))
      .then(() => knex('clients').insert(clients)
      );
    })
  };
