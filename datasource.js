const { DataSource } = require('typeorm')

const AppDataSource = new DataSource({
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'qwe123',
  database: 'medusa--hl3',
  entities: [
    'dist/models/*{.js,.ts}'
  ],
  migrations: [
    'dist/migrations/*{.js,.ts}'
  ]
})

module.exports = {
  datasource: AppDataSource
}
