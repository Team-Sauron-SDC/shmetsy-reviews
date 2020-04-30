DROP DATABASE IF EXISTS reviewList;

CREATE DATABASE reviewList;

USE reviewList;

CREATE TABLE reviews (
  id integer NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL,
  rating decimal(2,1) NOT NULL,
  reviewDate varchar(10) NOT NULL,
  review varchar(500) NOT NULL,
  productID integer NOT NULL,
  shopID integer NOT NULL,
  PRIMARY KEY(id)
);