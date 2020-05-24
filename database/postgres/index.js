/* eslint-disable no-console */
/* eslint-disable no-multi-str */
const { Pool } = require('pg');

let pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_PASSWORD ? 'db' : 'localhost',
  password: process.env.POSTGRES_PASSWORD || '',
  port: 5432,
});

pool.query('CREATE DATABASE reviewsdb', (reviewsdb) => {
  if (reviewsdb) {
    console.log('reviewsdb exists');
  } else {
    console.log('db created!');
  }
  pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_PASSWORD ? 'db' : 'localhost',
    password: process.env.POSTGRES_PASSWORD || '',
    port: 5432,
    database: 'reviewsdb',
  });
  pool.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL PRIMARY KEY,
    username varchar(100) default '' NOT NULL,
    rating integer,
    reviewDate DATE NOT NULL,
    review varchar(500) default '' NOT NULL,
    productID integer default 0 NOT NULL,
    shopID integer default 1 NOT NULL)`, (err) => {
    if (err) {
      console.log('reviews table exists');
    }
  });
});

const readProductReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where productid = ${id}`;
  pool.query(queryStr, (err, results) => {
    if (err || results.length === 0) {
      callback(err || 'empty set');
    } else {
      callback(null, results.rows);
    }
  });
};

const readShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews WHERE shopid = ${id}`;
  pool.query(queryStr, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results.rows);
    }
  });
};

const createReviews = (entry, callback) => {
  const queryStr = 'INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
  const {
    username, rating, reviewDate, review, productID, shopID,
  } = entry;
  const params = [username, rating, reviewDate, review, productID, shopID];
  pool.query(queryStr, params, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

const updateReview = (data, callback) => {
  const { entry, id } = data;
  let query = 'UPDATE reviews \
              SET ';
  const keys = Object.keys(entry);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    query += `${key} = '${entry[key]}', `;
  }
  query = query.slice(0, query.length - 2);
  query += ` WHERE id = '${id}'`;
  pool.query(query, (err, result) => {
    if (err) {
      callback(err, result);
    }
    callback(null, result);
  });
};

const deleteReview = (id, callback) => {
  const query = `DELETE FROM reviews WHERE id = '${id}'`;
  pool.query(query, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
  createReviews, readProductReviews, readShopReviews, updateReview, deleteReview,
};
