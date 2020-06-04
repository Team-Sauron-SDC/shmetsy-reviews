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
  // const shopid = faker.random.number({ min: 1, max: 100000 });
  const data = {
    username, rating, reviewdate, review,
  };
  // const params = [user, rating, reviewdate, review, productid, shopid];
  return data;
};

const dataGen = (writerOne, writerTwo, encoding, callback) => {
  let i = 100;
  let productid = 0;
  let shopid = 1;
  let shop = [];
  function write() {
    let ok = true;
    let ok2 = true;
    do {
      i -= 1;
      if (i % 3 === 0) {
        productid += 1;
      }
      const entry = gen();
      entry.id = i;
      let data = `${entry.id}, ${entry.username}, ${entry.rating}, ${entry.reviewdate}, ${entry.review}, ${productid}, ${shopid}`;
      shop.push(entry);
      const shopData = `${shopid}, ${JSON.stringify(shop)}\n`;
      data = `${data}\n`;
      if (i === 0) {
        writerOne.write(data, encoding, callback);
        writerTwo.write(shopData, encoding, callback);
      } else {
        ok = writerOne.write(data, encoding);
        if (i % 4 === 0) {
          ok2 = writerTwo.write(shopData, encoding);
          shopid += 1;
          shop = [];
        }
      }
    } while (i > 0 && ok && ok2);
    if (i > 0) {
      writerOne.once('drain', write);
      writerTwo.once('drain', write);
    }
  }
  console.log(`Seeding Start at ${start.toUTCString()}`);
  write();
};

const writeData = fs.createWriteStream('data/data.csv', {
  flags: 'w',
  emitClose: true,
});

const writeShops = fs.createWriteStream('data/shops.csv', {
  flags: 'w',
  emitClose: true,
});

// start trying to enclose the query into a callback

writeData.write('id, username, rating, reviewdate, review, productid, shopid\n', 'utf8');
writeShops.write('shopid, shops\n', 'utf8');

dataGen(writeData, writeShops, 'utf-8', () => {
  writeData.end(() => {
    console.log('data gen ended');
  });
  writeShops.end(() => {
    console.log('shop copy ended');
  });
  const ending = new Date().getTime() - start.getTime();
  console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
});
