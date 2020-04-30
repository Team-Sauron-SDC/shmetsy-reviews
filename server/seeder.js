
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

  let user = faker.name.findName();

  let rating = faker.random.number({min:0, max:5});

  let reviewDate = faker.date.between('2020-01-01','2020-04-21');

  let review = faker.lorem.sentences(3,3);

  let productID = faker.random.number({min:2, max:100});

  let shopID = faker.random.number({min:1, max:10});

  let queryStr = `INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES (?,?,?,?,?,?)`;

  let params = [user, rating, reviewDate, review, productID, shopID];

  connection.query(queryStr, params, (err,res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("row insertion successful!");
    }
  });
};

connection.end();




