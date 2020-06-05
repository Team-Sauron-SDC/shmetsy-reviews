const entry = (userContext, events, done) => {
  // username, rating, reviewdate, review, productid, shopid
  userContext.vars.username = 'Carlitos Willis';
  userContext.vars.rating = 5;
  userContext.vars.reviewdate = '2020-05-30';
  userContext.vars.review = 'this is great stuff. i really like this stuff.';
  userContext.vars.shopid = 100000;
  userContext.vars.productid = 10000001;
  return done();
};

const page = (userContext, events, done) => {
  // from MDN
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  userContext.vars.id = getRandomInt(9000000, 10000002);
  // console.log(`http://localhost:5000/api/reviews/${userContext.vars.id}/`);
  return done();
};


module.exports = {
  page, entry,
};
