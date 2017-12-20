// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'killbase-app',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
			host: 'ec2-184-73-240-228.compute-1.amazonaws.com'
      database: 'dc80i9vf3deqgs',
      user:     'jgofxjytdtakcq',
			port: '5432'
      password: '93ceeb250f41ca329b43a417cea5bbe112d6a028b794c10291eb6b2bd4c995c7'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
