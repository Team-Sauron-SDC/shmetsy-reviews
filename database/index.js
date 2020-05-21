const db = require('mysql');
const config = require('../server/sqlconfig.js');

const connection = db.createConnection(config);

// const connection = db.createConnection({
//   host: 'database-1.clczllep9gvm.us-east-2.rds.amazonaws.com',
//   user: 'admin',
//   password: 'gh3456adswere',
//   database: 'reviewList'
// });

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    // eslint-disable-next-line no-console
    console.log('DB connected!');
  }
});

const getProductReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where productID = ${id}`;
  connection.query(queryStr, (err, docs) => {
    if (err) {
      callback(err);
    } else {
      callback(docs);
    }
  });
};

const getShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where shopID = ${id}`;
  connection.query(queryStr, (err, docs) => {
    if (err) {
      callback(err);
    } else {
      callback(docs);
    }
  });
};

const insertReviews = (req, callback) => {
  const queryStr = 'INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES (?,?,?,?,?,?)';
  const {
    user, rating, reviewDate, review, productID, shopID,
  } = req.body;
  const params = [user, rating, reviewDate, review, productID, shopID];
  connection.query(queryStr, params, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  getProductReviews,
  getShopReviews,
  insertReviews,
};
