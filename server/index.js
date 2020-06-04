/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('newrelic');
const Redis = require('ioredis');
const cluster = require('cluster');
const compression = require('compression');
const bunyan = require('bunyan');
const {
  env, express, path, bodyParser, cors, db,
} = require('./imports');

const redis = new Redis();
const redisOn = true;

const log = bunyan.createLogger({ name: 'production' });
// log.info('Hello!');


// if (cluster.isMaster) {
// log.info('this is a master');
//  cluster.fork();
//  cluster.fork();
// } else {
// log.info('this is a worker');
const app = express();
app.use(compression());
app.use(cors());
// app.use(express.static(path.join(__dirname, '/../public')));
// app.use('/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

const port = 80;
app.listen(port, () => log.info(`App is listening at http://localhost:${port}`));

app.post('/api/reviews/', (req, res) => {
  db.createReviews(req.body, (err, results) => {
    if (err) {
      res.status(404);
      res.end();
      throw err;
    }
    res.status(201);
    res.end();
  });
});

const getShopReviews = (data, req, res) => {
  const shop = data[0] ? data[0].shopid : 1;
  db.readShopReviews(shop, (shopErr, results) => {
    if (shopErr) {
      res.status(404);
      res.end();
      log.info(shopErr);
    } else {
      redis.set(`shopid: ${shop}`, JSON.stringify(results))
        .catch((e) => log.info(e));
      const ids = new Set(data.map((review) => review.id));
      let unsorted = new Set([...data]);
      for (let i = 0; i < results.length; i += 1) {
        if (!ids.has(results[i].id)) {
          unsorted.add(results[i]);
        }
      }
      unsorted = Array.from(unsorted);
      const sorted = unsorted.sort((a, b) => b.reviewDate - a.reviewDate);
      res.status(200).send(sorted);
    }
  });
};
const getCachedShop = (data, req, res) => {
  // Check the cache data from the server redis
  const shopid = data[0] ? data[0].shopid : 1;
  redis.get(`shopid: ${shopid}`, (err, result) => {
    if (redisOn && result) {
      result = JSON.parse(result);
      const ids = new Set(data.map((review) => review.id));
      let unsorted = new Set([...data]);
      for (let i = 0; i < result.length; i += 1) {
        if (!ids.has(result[i].id)) {
          unsorted.add(result[i]);
        }
      }
      unsorted = Array.from(unsorted);
      const sorted = unsorted.sort((a, b) => b.reviewDate - a.reviewDate);
      res.status(200).send(sorted);
    } else {
      getShopReviews(data, req, res);
    }
  })
    .catch((err) => {
      getShopReviews(req, res);
    });
};
const getProductReviews = (req, res) => {
  const { id } = req.params;
  db.readProductReviews(id, (err, data) => {
    // data should be an array of reviews of product ${id}
    if (err) {
      res.status(404);
      res.end();
      log.info(err);
    } else {
      redis.set(`productid: ${id}`, JSON.stringify(data))
        .catch((e) => log.info(e));
      getCachedShop(data, req, res);
    }
  });
};


const getCachedProducts = (req, res) => {
  // Check the cache data from the server redis
  log.info('getting');
  const { id } = req.params;
  if (id === 'nan') {
    res.end('pick a product');
  } else {
    redis.get(`productid: ${id}`, (err, result) => {
      if (redisOn && result) {
        result = JSON.parse(result);
        // res.send(result);
        getCachedShop(result, req, res);
      } else {
        getProductReviews(req, res);
      }
    })
      .catch((err) => {
        getProductReviews(req, res);
      });
  }
};

app.get('/api/test/:id', (req, res) => {
  log.info('test getting');
  const { id } = req.params;
  db.readReview(id, (err, result) => {
    if (err) log.info(err);
    res.send(result);
  });
});

app.get('/api/reviews/:id', getCachedProducts);

app.patch('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.updateReview({ entry: req.body, id }, (err, results) => {
    if (err) {
      log.info(err);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.deleteReview(id, (err, results) => {
    if (err) {
      log.info(err);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});
//  }
