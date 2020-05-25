/* eslint-disable no-console */
/* eslint-disable no-multi-str */
const pool = require('./pgConfig');

pool.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL,
  username varchar(100) default '' NOT NULL,
  rating integer,
  reviewdate DATE NOT NULL,
  review varchar(500) default '' NOT NULL,
  productid integer default 0 NOT NULL,
  shopid integer default 1 NOT NULL,
  PRIMARY KEY (id, productid, shopid))`, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('table created');
  }
});

// pool.query('CREATE DATABASE reviewsdb', (reviewsdb) => {
//   if (reviewsdb) {
//     console.log('reviewsdb exists');
//   } else {
//     console.log('db created!');
//   }
// });

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
