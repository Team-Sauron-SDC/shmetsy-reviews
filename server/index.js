/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const {
  env,
  express,
  path,
  bodyParser,
  cors,
  mysql,
  config,
  db,
} = require('./imports');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/:id', express.static(`${__dirname}/../public`));
app.use(bodyParser.json());

const port = 5000;
const host = '0.0.0.0';
app.listen(port, host, () => console.log(`App is listening at http://localhost:${host}:${port}`));

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('DB connected!');
  }
});

app.get('/reviews/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  db.getProductReviews(id, (data) => {
    const shop = data[1].shopID;
    db.getShopReviews(shop, (results) => {
      const unsorted = [];
      for (let i = 0; i < results.length; i += 1) {
        unsorted.push(results[i]);
      }
      const sorted = unsorted.sort((a, b) => b.reviewDate - a.reviewDate);
      res.status(200).send(sorted);
    });
  });
});

app.post('/reviews/', (req, res) => {
  db.insertReviews(req, (err, results) => {
    // db.getProductReviews(results.id, (data) => {
    //   const shop = data[1].shopID;
    //   db.getShopReviews(shop, (results) => {
    //     const unsorted = [];
    //     for (let i = 0; i < results.length; i += 1) {
    //       unsorted.push(results[i]);
    //     }
    //     const sorted = unsorted.sort((a, b) => b.reviewDate - a.reviewDate);
    //     res.status(201).send(sorted);
    //   });
    // });
    console.log(results);
    res.status(201);
    res.end(JSON.stringify(results));
  });
});
