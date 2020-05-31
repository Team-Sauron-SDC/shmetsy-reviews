/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const db = require('../database/index.js');

module.exports = {
  env, express, path, bodyParser, cors, /* db, */
};
