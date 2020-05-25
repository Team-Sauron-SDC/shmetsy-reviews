// postgres/pgConfig.js
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

let connectionString;

// docker
if (process.env.POSTGRES_USER) {
  connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres_db_1:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
  module.exports = new Pool({
    connectionString,
  });
} else {
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/reviewsdb`;
  module.exports = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  });
}

// DB_USER=postgres
// DB_PASSWORD=password
// DB_HOST=localhost
// DB_PORT=5432
// DB_DATABASE=reviewsdb
