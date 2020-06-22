# Ezzy Shop

![Ezzy Logo](https://i.imgur.com/skGy7Wf.png)

# Reviews

> The reviews section / component renders all the reviews of different products– with details about the review, the reviewer, the product, and the shop

## Related Projects

  - [Suggested](https://github.com/Team-Sauron-SDC/ezzy-shop-suggested-service)
  - [Information](https://github.com/Team-Sauron-SDC/Shmetsy-Info-Service)
  - [Carousel](https://github.com/Team-Sauron-SDC/Shmetsy-carousel)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

### Prerequisites

```
node 12.16.1
PostgreSQL 12
Redis 6.0
```

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. If you need ipsum data, run the command - npm run seed, and copy the resulting csv into your test DB.

### Built With

* [node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)

To install PostgreSQL, please follow these [instructions](https://www.postgresql.org/download/linux/ubuntu/)
To intall Redis, please follow these [instructions](https://redis.io/download)

### Deployment

This app was deployed using [Heroku](https://dashboard.heroku.com/)

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

## Getting Started
```sh
docker-compose up
```

## Running the tests

```sh
npm run test
```

## Running server and client locally

```sh
npm run build
npm start
```

## CRUD Operations
| HTTP Verb |           Endpoint          |            Action            |
|-----------| --------------------------- | ---------------------------- |
| **POST**  |         /api/reviews/         |  CREATE a new review in DB   |
| **GET**   |       /api/reviews/:id        |  READ data and return data   |
| **PATCH** |       /api/reviews/:id        |  UPDATE review               |
| **DELETE**|       /api/reviews/:id        |  DELETE review based on ID   |
