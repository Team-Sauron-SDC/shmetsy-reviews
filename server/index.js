/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
require('newrelic');
const {
  env, express, path, bodyParser, cors, db,
} = require('./imports');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

const port = 5000;
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

app.get('/api/reviews/:id', (req, res) => {
  console.log('attempting to retreive data');
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
