
const db = require('mysql');
const config = require('./sqlconfig.js');
const faker = require('faker');

const connection = db.createConnection(config);

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});



for(var i = 0; i < 5; i ++) {
  let user = faker.fake("{{name.firstName}}");

  let rating = faker.fake("{{random.number}}");

  let reviewDate = "1994-09-23";

  let review = "THIS THING WORKS";

  let productID = 4;

  let shopID = 6;

  let queryStr = `INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES (?,?,?,?,?,?)`;

  let params = [user,rating,reviewDate,review,productID,shopID];

  connection.query(queryStr, params,(err,res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("row insertion successful!");
    }
  });
};




