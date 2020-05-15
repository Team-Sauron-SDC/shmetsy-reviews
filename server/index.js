/* eslint-disable linebreak-style */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const path = require('path');
const config = require('./sqlconfig.js');
const cors = require('cors');
const db = require('../database/index.js');
const mysql = require('mysql');
app.use(cors());
app.use(express.static(path.join(__dirname, '/../public')));
app.use("/:id", express.static(__dirname + '/../public'));
app.use(bodyParser.json());
const port = 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`App is listening at http://localhost:${host}:${port}`));


const connection = mysql.createConnection(config);

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
  db.getProductReviews(id,(data) => {
    const shop = data[1].shopID;
    db.getShopReviews(shop, (results) => {
      let unsorted = [];
      for(var i = 0; i < results.length; i ++) {
        unsorted.push(results[i]);
      }
      const sorted = unsorted.sort((a,b) => b.reviewDate - a.reviewDate);
      res.status(200).send(sorted);
    })
  })
});