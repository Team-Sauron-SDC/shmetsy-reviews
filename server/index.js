const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv');
const db = require('mysql');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = 3000;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

const connection = db.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,


});