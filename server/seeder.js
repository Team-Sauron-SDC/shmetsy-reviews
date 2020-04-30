
const db = require('mysql');
const config = require('./sqlconfig.js');

const connection = db.createConnection(config);

connection.connect(err => {
  if(err) {
    throw err;
  } else {
    console.log("DB connected!");
  }
});

