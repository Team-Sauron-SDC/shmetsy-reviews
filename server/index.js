/* eslint-disable linebreak-style */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const db = require('mysql');
const path = require('path');
const config = require('./sqlconfig.js');
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, '/../public')));
app.use("/:id", express.static(__dirname + '/../public'));
app.use(bodyParser.json());
const port = 5000;
const host = '0.0.0.0';
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

const connection = db.createConnection(config);

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});

app.get('/reviews/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  getProductReviews(id,(data) => {
    const shop = data[1].shopID;
    getShopReviews(shop, (results) => {
      let unsorted = [];
      for(var i = 0; i < results.length; i ++) {
        unsorted.push(results[i]);
      }
      const sorted = unsorted.sort((a,b) => b.reviewDate - a.reviewDate);
      res.status(200).send(sorted);
    })
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

