/* eslint-disable quotes */
/* eslint-disable no-console */
const uuid = require('uuid');
const fs = require('fs');
const faker = require('faker');

const gen = () => {
  const username = faker.name.findName();
  const rating = faker.random.number({ min: 0, max: 5 });
  const reviewdate = faker.date.between('2012-01-01', '2020-04-21').toISOString().split('T')[0];
  const review = faker.lorem.sentences();
  // const productid = faker.random.number({ min: 1, max: 100 });
  const shopid = faker.random.number({ min: 1, max: 100000 });
  const id = uuid.v1();
  const data = {
    username, rating, reviewdate, review, shopid, id,
  };
  return data;
};

const start = new Date();
const writeData = fs.createWriteStream('data/data.csv', {
  flags: 'w',
});
writeData.write('username, rating, reviewdate, review, productid, shopid\n', 'utf8');

const dataGen = (writer, encoding, callback) => {
  let i = 30000000;
  let productid = 1;
  function write() {
    let ok = true;
    do {
      i -= 1;
      if (i % 3 === 0) {
        productid += 1;
      }
      const entry = gen();
      const data = `${entry.id}, ${entry.username}, ${entry.rating}, ${entry.reviewdate}, ${entry.review}, ${productid}, ${entry.shopid}\n`;
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

dataGen(writeData, 'utf-8', () => {
  writeData.end();
  const ending = new Date().getTime() - start.getTime();
  console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
});
