/* eslint-disable no-console */
const fs = require('fs');
const faker = require('faker');

const start = new Date();

const gen = () => {
  const username = faker.name.findName();
  const rating = faker.random.number({ min: 0, max: 5 });
  const reviewdate = faker.date.between('2012-01-01', '2020-04-21').toISOString().split('T')[0];
  const review = faker.lorem.sentences();
  // const productid = faker.random.number({ min: 1, max: 100 });
  const shopid = faker.random.number({ min: 1, max: 100000 });
  const data = {
    username, rating, reviewdate, review, shopid,
  };
  // const params = [user, rating, reviewdate, review, productid, shopid];
  return data;
};

const dataGen = (writer, encoding, callback) => {
  let i = 3000;
  let productid = 1;
  function write() {
    let ok = true;
    do {
      i -= 1;
      if (i % 3 === 0) {
        productid += 1;
      }
      const entry = gen();
      const data = `${entry.username}, ${entry.rating}, ${entry.reviewdate}, ${entry.review}, ${productid}, ${entry.shopid}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  console.log(`Seeding Start at ${start.toUTCString()}`);
  write();
};

const { Pool } = require('pg');

let pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_PASSWORD ? 'db' : 'localhost',
  password: process.env.POSTGRES_PASSWORD || '',
  port: 5432,
});

pool.query('CREATE DATABASE reviewsdb', (reviewsdb) => {
  if (reviewsdb) {
    console.log('reviewsdb exists');
  } else {
    console.log('db created!');
  }
  pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_PASSWORD ? 'postgres_db_1' : 'localhost',
    password: process.env.POSTGRES_PASSWORD || '',
    port: 5432,
    database: 'reviewsdb',
  });
  const writeData = fs.createWriteStream('data/data.csv', {
    flags: 'w',
    emitClose: true,
  });

  // start trying to enclose the query into a callback

  writeData.write('username, rating, reviewdate, review, productid, shopid\n', 'utf8');
  dataGen(writeData, 'utf-8', () => {
    writeData.end(() => {
      console.log('write stream ended');
      pool.query(`CREATE TABLE IF NOT EXISTS reviews(id SERIAL,
        username varchar(100) default '' NOT NULL,
        rating integer,
        reviewdate DATE NOT NULL,
        review varchar(500) default '' NOT NULL,
        productid integer default 0 NOT NULL,
        shopid integer default 1 NOT NULL,
        PRIMARY KEY (id, shopid, productid))`, (createrr) => {
        if (createrr) {
          console.log(createrr);
        } else {
          // eslint-disable-next-line quotes
          const dataDir = process.env.POSTGRES_USER ? '/data/data.csv' : '/Users/carlitoswillis/local/hr/sdc-system-design-capstone/reviews/data/data.csv';
          pool.query(`COPY reviews(username, rating, reviewdate, review, productid, shopid) FROM '${dataDir}' DELIMITER ',' CSV HEADER`, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('copying data into reviews');
            }
          });
        }
      });
    });
    const ending = new Date().getTime() - start.getTime();
    console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
  });
});

// /* eslint-disable quotes */
// /* eslint-disable no-console */
// const fs = require('fs');
// const faker = require('faker');
// const pool = require('./pgConfig');

// const start = new Date();

// const gen = () => {
//   const username = faker.name.findName();
//   const rating = faker.random.number({ min: 0, max: 5 });
//   const reviewdate = faker.date.between('2012-01-01', '2020-04-21').toISOString().split('T')[0];
//   const review = faker.lorem.sentences();
//   // const productid = faker.random.number({ min: 1, max: 100 });
//   const shopid = faker.random.number({ min: 1, max: 100000 });
//   const data = {
//     username, rating, reviewdate, review, shopid,
//   };
//   // const params = [user, rating, reviewdate, review, productid, shopid];
//   return data;
// };

// const dataGen = (writer, encoding, callback) => {
//   // let i = 30000000;
//   let i = 300;
//   let productid = 1;
//   function write() {
//     let ok = true;
//     do {
//       i -= 1;
//       if (i % 3 === 0) {
//         productid += 1;
//       }
//       const entry = gen();
//       const data = `${entry.username}, ${entry.rating}, ${entry.reviewdate}, ${entry.review}, ${productid}, ${entry.shopid}\n`;
//       if (i === 0) {
//         writer.write(data, encoding, callback);
//       } else {
//         ok = writer.write(data, encoding);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       writer.once('drain', write);
//     }
//   }
//   console.log(`Seeding Start at ${start.toUTCString()}`);
//   write();
// };

// const writeData = fs.createWriteStream('data/data.csv', {
//   flags: 'w',
//   emitClose: true,
// });
// writeData.write('username, rating, reviewdate, review, productid, shopid\n', 'utf8');
// dataGen(writeData, 'utf-8', () => {
//   writeData.end(() => {
//     console.log('write stream ended');
//     console.log('trying to to start copying data into reviews');
//     pool.query(`COPY reviews(username, rating, reviewdate, review, productid, shopid) FROM '/data/data.csv' DELIMITER ',' CSV HEADER`, (err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('copying data into reviews');
//       }
//     });
//   });
//   const ending = new Date().getTime() - start.getTime();
//   console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
// });
