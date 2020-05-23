/* eslint-disable no-multi-str */
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['localhost'] });
// , localDataCenter: 'datacenter1', keyspace: 'sauron_sdc' });

const getProductReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where productid = ${id}`;
  client.query(queryStr, (err, results) => {
    if (err || results.length === 0) {
      callback(err || 'empty set');
    } else {
      callback(null, results.rows);
    }
  });
};

const getShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews WHERE shopid = ${id}`;
  client.query(queryStr, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results.rows);
    }
  });
};

const insertReviews = (entry, callback) => {
  const queryStr = 'INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
  const {
    username, rating, reviewDate, review, productID, shopID,
  } = entry;
  const params = [username, rating, reviewDate, review, productID, shopID];
  client.query(queryStr, params, (err, result) => {
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
  client.query(query, (err, result) => {
    if (err) {
      callback(err, result);
    }
    callback(null, result);
  });
};

const deleteReview = (id, callback) => {
  const query = `DELETE FROM reviews WHERE id = '${id}'`;
  client.query(query, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
  getProductReviews,
  getShopReviews,
  insertReviews,
  updateReview,
  deleteReview,
};
