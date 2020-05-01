/* eslint-disable linebreak-style */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const db = require('mysql');
app.use("/:id", express.static(__dirname + '/../public'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true,
// }));
const port = 3000;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

const connection = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'reviewList',
});

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/1/')
});

app.get('/reviews/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  getProductReviews(id,(data) => {
    console.log("heres the data", data[1]);
    const shop = data[1].shopID;
    console.log(shop);
    getShopReviews(shop, (results) => {
      res.status(200).send(results);
    })
    // res.status(200).send(data);
  })
})

//--------------------------- DB FUNCTIONS -----------------------------//

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

