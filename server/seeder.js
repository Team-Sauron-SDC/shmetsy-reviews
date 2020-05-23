/* eslint-disable linebreak-style */
const db = require('mysql');
const faker = require('faker');
const config = require('./sqlconfig.js');


const connection = db.createConnection(config);

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('DB connected!');
  }
});

for (let i = 0; i < 1000000; i += 1) {
  const user = faker.name.findName();
  const rating = faker.random.number({ min: 0, max: 5 });
  const reviewdate = faker.date.between('2012-01-01', '2020-04-21');
  const review = faker.lorem.sentences();
  const productid = faker.random.number({ min: 2, max: 100 });
  const shopid = faker.random.number({ min: 1, max: 10 });
  const queryStr = 'INSERT INTO reviews (username,rating,reviewDate,review,productID,shopID) VALUES (?,?,?,?,?,?)';
  const params = [user, rating, reviewdate, review, productid, shopid];
}

connection.end();
