/* eslint-disable no-console */
/* eslint-disable no-multi-str */
const cassandra = require('cassandra-driver');

const tempClient = new cassandra.Client({ contactPoints: ['db'], localDataCenter: 'datacenter1', keyspace: 'system' });
const client = new cassandra.Client({ contactPoints: ['db'], localDataCenter: 'datacenter1', keyspace: 'sauron_sdc' });
tempClient.connect()
  .then(() => {
    const create = "CREATE KEYSPACE IF NOT EXISTS sauron_sdc WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' }AND DURABLE_WRITES =  true;";
    return tempClient.execute(create);
  })
  .then(() => {
    client.connect((err) => (err ? console.log('There was an ERROR', err) : console.log('Connected to Cassandra!')));
  })
  .then(() => {
    const createTable = 'CREATE TABLE IF NOT EXISTS sauron_sdc.reviews (id int, username text, rating int, reviewdate text, review text, productid int, shopid int, PRIMARY KEY(id, shopID, productID))';
    return client.execute(createTable);
  })
  .then(() => {
    // create index on -> id? productid?, shopID?
  })
  .catch((err) => console.log('Cannot Connect to Cassandra!', err));

const readProductReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where productid = ${id}`;
  client.execute(queryStr, (err, results) => {
    if (err || results.length === 0) {
      callback(err || 'empty set');
    } else {
      callback(null, results.rows);
    }
  });
};

const readShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews WHERE shopid = ${id}`;
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
