DROP DATABASE IF EXISTS reviewList;

CREATE DATABASE reviewList;

USE reviewList;

CREATE TABLE reviews (
  id integer NOT NULL AUTO_INCREMENT,
  username varchar(100) default '' NOT NULL,
  rating integer,
  reviewDate varchar(10) default '' NOT NULL,
  review varchar(500) default '' NOT NULL,
  productID integer default 0 NOT NULL,
  shopID integer default 1 NOT NULL,
  PRIMARY KEY(id)
);