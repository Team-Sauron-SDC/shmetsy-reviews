/* eslint-disable no-console */
const cassandra = require('cassandra-driver');
const fs = require('fs');
const faker = require('faker');

const tempClient = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'system' });
const client = new cassandra.Client({ contactPoints: ['localhost'], localDataCenter: 'datacenter1', keyspace: 'sauron_sdc' });

const connectAndCreate = () => tempClient.connect()
  .then(() => {
    const create = "CREATE KEYSPACE IF NOT EXISTS sauron_sdc WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' }AND DURABLE_WRITES =  true;";
    return tempClient.execute(create);
  })
  .then(() => {
    client.connect((err) => (err ? console.log('There was an ERROR', err) : console.log('Connected to Cassandra!')));
  })
  .then(() => {
    const createTable = 'CREATE TABLE IF NOT EXISTS sauron_sdc.products_by_shop (shopID int, shopName text, shopDate text, shopSales int, shopLoc text, shopURL text, shopItems int, productID int, productName text, productPrice text, productShipping text, productUrl text, PRIMARY KEY(shopID, productID))';

    return client.execute(createTable);
  })
  .catch((err) => console.log('Connection ERROR', err));

const seedDB = (id) => {
  const data = {
    shopID: id,
    shopName: faker.company.companyName(0),
    shopDate: faker.date.recent().toString(),
    shopSales: faker.random.number(50000),
    shopLoc: `${faker.address.city()}, ${faker.address.state()}`,
    shopURL: faker.image.avatar(),
    shopItems: faker.random.number(1000),
    productID: id,
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productShipping: faker.random.boolean() ? 'FREE Shipping' : 'Free Shipping Eligible',
    productURL: faker.image.cats(),
  };
  return data;
};
// COPY is a command of the shell cqlsh. COPY does not exist in standard syntax
/*
const save = () => {
  const query = 'COPY sauron_sdc.products_by_shop (shopID, shopName, shopDate, shopSales, shopLoc, shopURL, shopItems, productID, productName, productPrice, productShipping, productURL) FROM ? WITH header=true AND delimiter=?';
  const params = ['/home/hieuho/Hack Reactor/sdc/suggested-module/data.csv', ','];
  client.execute(query, params);
  console.log('copied');
};
*/

const start = new Date();
const writeData = fs.createWriteStream('data.csv', {
  flags: 'w',
});
writeData.write('shopID, shopName, shopDate, shopSales, shopLoc, shopURL, shopItems, productID, productName, productPrice, productShipping, productURL\n', 'utf8');

const dataGen = (writer, encoding, callback) => {
  let i = 10000000;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      const shopID = id;
      const shopName = faker.company.companyName(0);
      const shopDate = faker.date.recent().toString();
      const shopSales = faker.random.number(50000);
      const shopLoc = faker.address.state();
      const shopURL = faker.image.avatar();
      const shopItems = faker.random.number(1000);
      const productID = id;
      const productName = faker.commerce.productName();
      const productPrice = faker.commerce.price();
      const productShipping = faker.random.boolean() ? 'FREE Shipping' : 'Free Shipping;const Eligible';
      const productURL = faker.image.cats();
      const data = `${shopID}, ${shopName}, ${shopDate}, ${shopSales}, ${shopLoc}, ${shopURL}, ${shopItems}, ${productID}, ${productName}, ${productPrice}, ${productShipping}, ${productURL}\n`;
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

const seed = () => connectAndCreate()
  .then(() => {
    dataGen(writeData, 'utf-8', () => {
      writeData.end();
      const ending = new Date().getTime() - start.getTime();
      console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
    });
  })
  .catch((err) => console.log('seed error', err));

seed();
