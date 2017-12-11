exports.seed = function(knex, Promise) {
  const fs = require('fs');

  // get/parse/clean both files
  let assassinsCsv = fs.readFileSync('./data/assassins.csv', 'UTF-8');
  let assassins = assassinsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
  let contractsCsv = fs.readFileSync('./data/contracts.csv', 'UTF-8');
  let contracts = contractsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));

  // create people objects without duplicates
  let names = [];
  let people = [];
  for (let i = 1; i < assassins.length; i++) {
    if (!names.includes(assassins[i][0])) {
      names.push(assassins[i][0]);
      people.push({name: names[names.length - 1]});
    }
  }
  for (let i = 1; i < contracts.length; i++) {
    if (!names.includes(contracts[i][0])) {
      names.push(contracts[i][0]);
      people.push({name: names[names.length - 1]});
    }
    if (!names.includes(contracts[i][4])) {
      names.push(contracts[i][4]);
      people.push({name: names[names.length - 1]});
    }
  }

  return knex('people').del()
    .then(() => knex.schema.raw('alter sequence people_id_seq restart'))
    .then(() => knex('people').insert(people)
    );
};
