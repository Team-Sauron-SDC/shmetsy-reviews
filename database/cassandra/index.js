/* eslint-disable no-console */
/* eslint-disable no-multi-str */
const cassandra = require('cassandra-driver');

const tempClient = new cassandra.Client({ contactPoints: ['cassandra_db_1'], localDataCenter: 'datacenter1', keyspace: 'system' });
const client = new cassandra.Client({ contactPoints: ['cassandra_db_1'], localDataCenter: 'datacenter1', keyspace: 'reviewsdb' });
tempClient.connect()
  .then(() => {
    const create = "CREATE KEYSPACE IF NOT EXISTS reviewsdb WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' }";
    return tempClient.execute(create);
  })
  .then(() => {
    client.connect((err) => (err ? console.log('There was an ERROR', err) : console.log('Connected to Cassandra!')));
  })
  .then(() => {
    const createTable = 'CREATE TABLE IF NOT EXISTS reviewsdb.reviews_by_shopid (id timeuuid, username text, rating int, reviewdate text, review text, productid int, shopid int, PRIMARY KEY((shopid), id, productid))';
    return client.execute(createTable);
  })
  .then(() => {
    const createTable = 'CREATE TABLE IF NOT EXISTS reviewsdb.reviews_by_productid (id timeuuid, username text, rating int, reviewdate text, review text, productid int, shopid int, PRIMARY KEY((productid), id, shopid))';
    return client.execute(createTable);
  })
  .catch((err) => console.log('Cannot Connect to Cassandra!', err));

const readProductReviews = (id, callback) => {
  const queryStr = `SELECT * from reviewsdb.reviews_by_productid where productid = ${id}`;
  client.execute(queryStr, (err, results) => {
    if (err || results.length === 0) {
      callback(err || 'empty set');
    } else {
      callback(null, results.rows);
    }
  });
};

const readShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviewsdb.reviews_by_shopid WHERE shopid = ${id}`;
  client.execute(queryStr, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results.rows);
    }
  });
};

const createReviews = (entry, callback) => {
  const queryStr = 'INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES (?,?,?,?,?,?) RETURNING *';
  const {
    username, rating, reviewDate, review, productID, shopID,
  } = entry;
  const params = [username, rating, reviewDate, review, productID, shopID];
  client.execute(queryStr, params, (err, result) => {
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
  client.execute(query, (err, result) => {
    if (err) {
      callback(err, result);
    }
    callback(null, result);
  });
};

const deleteReview = (id, callback) => {
  const query = `DELETE FROM reviews WHERE id = '${id}'`;
  client.execute(query, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
  client, createReviews, readProductReviews, readShopReviews, updateReview, deleteReview,
};
