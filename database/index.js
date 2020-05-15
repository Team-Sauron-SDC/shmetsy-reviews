const db = require('mysql');
const config = require('../server/sqlconfig.js');

// const connection = db.createConnection(config);



const connection = db.createConnection({
  host: 'database-1.clczllep9gvm.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'gh3456adswere',
  database: 'reviewList'
});

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});

const getProductReviews = (id, callback)  => {
  let queryStr = `SELECT * from reviews where productID = ${id}`;
  connection.query(queryStr, (err, docs) => {
    if (err) {
      callback(err);
    } else {
      callback(docs);
    }
  })
}

const getShopReviews = (id, callback) => {
  const queryStr = `SELECT * from reviews where shopID = ${id}`;
  connection.query(queryStr, (err, docs) => {
    if (err) {
      callback(err);
    } else {
      callback(docs);
    }
  })
}

module.exports = {
  getProductReviews,
  getShopReviews,
}