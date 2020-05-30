-- DROP TABLE reviews;

CREATE KEYSPACE reviewsdb WITH replication = {'class': 'NetworkTopology', 'replication_factor':1};

USE reviewsdb;

CREATE TABLE reviews_by_both (
  id int,
  username varchar,
  rating integer,
  reviewdate date,
  review varchar,
  productid integer,
  shopid integer,
  primarykey ((productid, shopid), id)
);

CREATE TABLE reviews_by_shopid (
  id int,
  username varchar,
  rating integer,
  reviewdate date,
  review varchar,
  productid integer,
  shopid integer,
  primarykey ((shopid), id)
);

CREATE TABLE reviews_by_productid (
  id int,
  username varchar,
  rating integer,
  reviewdate date,
  review varchar,
  productid integer,
  shopid integer,
  primarykey ((productid), id)
);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('John Jacob', 5, '2020-04-21', 'This mask is literally the best thing I have purchased in my entire 40 years of life. Just buy it...NOW', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Jingleheimer Schmidt', 4, '2020-04-18', 'Honestly, my brother John told me to get this mask and I have to say I am very happy. The quality is amazing! Outside of wishing there were more color options, I am satisfied and would recommend this product', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Lebron James', 3, '2020-04-28', 'Cool mask I guess...It fits well but tends to get a little uncomfortable over long periods. One day I hope I can stop wearing these things.', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('FBI Agent', 2, '2020-04-25', 'I bought this mask to help disguise my identity...and it did not work. I was on a super important mission and had to abort. Would not recommend this product', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Dolly Parton', 5, '2020-04-25', 'I bought these for my family and we could not be happier! This is an essential product to practice safety in these times', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Darth Vader', 3, '2020-04-23', 'I already need to breathe using a filter, and my friends complain about my loud breathing sounds. I bought this mask to practice goos safety, but now my breathing sounds are even louder!', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Ash Ketchum', 2, '2020-04-20', 'I bought this so I could keep cathching pokemon during this crisis. Unfortunately, the durablity of this mask is not great... A pidgey pecked right through this in a matter of seconds. ', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Ronnie Coleman', 5, '2020-04-30', 'This mask is straight up LIGHT WEIGHT. I wear it when I workout to look super cool.  I would recommend this product.', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Seth Rogen', 4, '2020-04-27', 'Insert signature Seth laugh here. This mask is awesome! My one gripe is that I wish there were alternate sizes for my large head.', 1, 1);

-- INSERT INTO reviews (username, rating, reviewdate, review, productid, shopid) VALUES ('Batman', 3, '2020-04-22', 'This mask helps me fight crime in Gotham while maintaining a certain standard of hygeine. It flies off sometimes when I dive off skyscrapers, but still is good for the price.', 1, 1);