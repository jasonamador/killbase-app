const fs = require('fs');

/*
  All of the assassins import stuff
*/
let assassinsCsv = fs.readFileSync('./data/assassins.csv', 'UTF-8');
let assassinsArrays = assassinsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
let assassins = [];
let people = [];
let codeNames = [];
let names = [];

let offset = 0;
for (let i = 1; i < assassinsArrays.length; i++) {
  if (!names.includes(assassinsArrays[i][0])) {
    names.push(assassinsArrays[i][0]);
    people.push({id: i - offset, name: assassinsArrays[i][0]});
    assassins.push({
      id: i - offset,
      person_id: i - offset,
      weapon: assassinsArrays[i][2],
      contact_info: assassinsArrays[i][3],
      age: assassinsArrays[i][4],
      price: assassinsArrays[i][5],
      rating: assassinsArrays[i][6],
      kills: assassinsArrays[i][7]
    });
    codeNames.push({assassin_id: i - offset, code_name: assassinsArrays[i][1]});
  } else {
    // currently this requires that an assassin with multiple codenames have all of their entries adjacent
    codeNames.push({assassin_id: i - (++offset), code_name: assassinsArrays[i][1]});
  }
}

/*
  Contracts import stuff
*/
let contractsCsv = fs.readFileSync('./data/contracts.csv', 'UTF-8');
let contractsArrays = contractsCsv.trim().replace(/"/g, '').split('\n').map((e) => e.split(', '));
let targets = [];
let clients = [];
let contracts = [];

offset = 0;
for (let i = 1; i < contractsArrays.length; i++) {
  if (!names.includes(contractsArrays[i][0])) {
    names.push(contractsArrays[i][0]);
    people.push({id: people.length + i - offset, name: contractsArrays[i][0]});
    targets.push({id: i - offset, person_id: people.length + i - offset});
  } else {
    // if a targets person already exists logic
  }
  if (!names.includes(contractsArrays[i][4])) {
    names.push(contractsArrays[i][4]);
    people.push({id: people.length + i - offset})
    clients.push({id: i - offset, person_id: people.length + i - offset});
  } else {
    // if clients is already a person
  }
  contracts.push({
    id: i,
    target_id: i - offset,
    client_id: i - offset,
    budget: contractsArrays[i][5],
    completed: false
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('people').del()
    .then(() => {
      // Inserts seed entries
      return knex('people').insert(people);
    })
    .then(() => {
      return knex('assassins').insert(assassins);
    })
    .then(() => {
      return knex('code_names').insert(codeNames);
    })
    .then(() => {
      return knex('targets').insert(targets);
    })
    .then(() => {
      return knex('clients').insert(clients);
    })
    .then(() => {
      return knex('contracts').insert(contracts);
    });
};
