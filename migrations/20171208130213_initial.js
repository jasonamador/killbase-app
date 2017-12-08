exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('people', (people) => {
    people.increments();
    people.string('name').defaultTo('unknown');
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('clients', (clients) => {
      clients.increments();
      clients.integer('person_id');
      clients.foreign('person_id').references('people.id').onDelete('CASCADE');
    });
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('targets', (targets) => {
      targets.increments();
      targets.integer('person_id');
      targets.foreign('person_id').references('people.id');
      targets.string('location');
      targets.string('photo');
      targets.float('security_level');
    });
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('assassins', (assassins) => {
      assassins.increments();
      assassins.integer('person_id');
      assassins.foreign('person_id').references('people.id').onDelete('CASCADE');
      assassins.string('weapon');
      assassins.string('contact_info');
      assassins.integer('price');
      assassins.float('rating');
      assassins.integer('kills');
      assassins.integer('age');
    });
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('code_names', (code_names) => {
      code_names.integer('assassin_id');
      code_names.foreign('assassin_id').references('assassins.id').onDelete('CASCADE');
      code_names.string('code_name');
    });
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('contracts', (contracts) => {
      contracts.increments();
      contracts.integer('target_id');
      contracts.foreign('target_id').references('targets.id').onDelete('SET NULL');
      contracts.integer('client_id');
      contracts.foreign('client_id').references('clients.id').onDelete('SET NULL');
      contracts.integer('budget');
      contracts.boolean('completed');
      contracts.integer('completed_by');
      contracts.foreign('completed_by').references('assassins.id').onDelete('SET NULL');
    });
  })
  .then(() => {
    return knex.schema.createTableIfNotExists('assassins_contracts', (assassins_contracts) => {
      assassins_contracts.integer('assassins_id');
      assassins_contracts.foreign('assassins_id').references('assassins.id').onDelete('CASCADE');
      assassins_contracts.integer('contracts_id');
      assassins_contracts.foreign('contracts_id').references('contracts.id').onDelete('CASCADE');
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('assassins_contracts')
    .then(() => knex.schema.dropTableIfExists('contracts'))
    .then(() => knex.schema.dropTableIfExists('code_names'))
    .then(() => knex.schema.dropTableIfExists('assassins'))
    .then(() => knex.schema.dropTableIfExists('targets'))
    .then(() => knex.schema.dropTableIfExists('clients'))
    .then(() => knex.schema.dropTableIfExists('people'));
};
