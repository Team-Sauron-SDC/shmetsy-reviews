/* eslint-disable no-console */
const fs = require('fs');
const faker = require('faker');
const cassandra = require('cassandra-driver');

const tempClient = new cassandra.Client({ contactPoints: ['db'], localDataCenter: 'datacenter1', keyspace: 'system' });
const client = new cassandra.Client({ contactPoints: ['db'], localDataCenter: 'datacenter1', keyspace: 'sauron_sdc' });
const connectAndCreate = () => tempClient.connect()
  .then(() => {
    const create = "CREATE KEYSPACE IF NOT EXISTS sauron_sdc WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : '1' }AND DURABLE_WRITES =  true;";
    return tempClient.execute(create);
  })
  .then(() => {
    client.connect((err) => (err ? console.log('There was an ERROR', err) : console.log('Connected to Cassandra!')));
  })
  .then(() => {
    const createTable = 'CREATE TABLE IF NOT EXISTS sauron_sdc.reviews ((id int), username text, rating int, reviewdate text, review text, productid int, shopid int, PRIMARY KEY(id, productID, shopID))';
    return client.execute(createTable);
  })
  .catch((err) => console.log('Cannot Connect to Cassandra!', err));

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

const start = new Date();
const writeData = fs.createWriteStream('data.csv', {
  flags: 'w',
});
writeData.write('username, rating, reviewdate, review, productid, shopid\n', 'utf8');

const dataGen = (writer, encoding, callback) => {
  let i = 10;
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


connectAndCreate()
  .then(() => {
    dataGen(writeData, 'utf-8', () => {
      writeData.end();
      client.execute('COPY reviews(username, rating, reviewdate, review, productid, shopid) FROM \'/Users/carlitoswillis/local/hr/sdc-system-design-capstone/reviews/data.csv\' DELIMITER \',\' CSV HEADER', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('copying data into reviews');
        }
      });
      const ending = new Date().getTime() - start.getTime();
      console.log(`Seeding Complete! It took: ${Math.floor(ending / 60000)}m and ${((ending % 60000) / 1000).toFixed(0)}secs`);
    });
  })
  .catch((err) => console.log('Connection or Seeding Error!', err));
