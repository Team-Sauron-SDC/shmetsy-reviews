const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const db = require('mysql');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = 3000;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

const connection = db.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS

});

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});



