/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('newrelic');
const {
  env, express, path, bodyParser, cors, db,
} = require('./imports');

const cluster = require('cluster');
const redis = require('redis');
const client = redis.createClient();

if (cluster.isMaster) {
  console.log('this is a master');
  cluster.fork()
  cluster.fork()
  cluster.fork()
  cluster.fork()
  cluster.fork()
} else {
  console.log('this is a worker');

/*
var http = require('follow-redirects').http;
var fs = require('fs');

var options = {
  'method': 'GET',
  'hostname': '169.254.169.254',
  'path': '/latest/meta-data/',
  'headers': {
  },
  'maxRedirects': 20
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();

*/
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

const port = 80;
app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

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

app.get('/api/test/', (req, res) => {
  console.log(cluster.worker.id)
  res.end('cluster', cluster.worker.id);
});

const getCache = (id, res) => {
  //Check the cache data from the server redis
  client.get(id, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      getBook(req, res);
    }
  });
}

app.get('/api/reviews/:id', (req, res) => {
  console.log('handling request with worker', cluster.worker.id);
  const { id } = req.params;
  db.readProductReviews(id, (err, data) => {
    // data should be an array of reviews of product ${id}
    if (err) {
      res.status(404);
      res.end();
      console.log(err);
    } else {
      const shop = data[0] ? data[0].shopid : 1;
      db.readShopReviews(shop, (shopErr, results) => {
        if (shopErr) {
          res.status(404);
          res.end();
          console.log(shopErr);
        } else {
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
    }
  });
});

app.patch('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.updateReview({ entry: req.body, id }, (err, results) => {
    if (err) {
      console.log(err);
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
      console.log(err);
      res.status(404);
      res.end();
    }
    res.status(204);
    res.end();
  });
});
}
