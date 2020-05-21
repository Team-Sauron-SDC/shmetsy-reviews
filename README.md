# Reviews

> The reviews section contains all the reviews of different products– with details about the review, the reviewer, the product, and the shop

## Related Projects

  - https://github.com/Team-Sauron-SDC/shmetsy-reviews-proxy
  - https://github.com/Team-Sauron-SDC/Shmetsy-carousel
  - https://github.com/Team-Sauron-SDC/Shmetsy-Info-Service
  - https://github.com/Team-Sauron-SDC/shmetsy-suggested-service

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)

## Usage

> Some usage instructions

## Requirements

- Node v12.16.1
- Docker

## Development


### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```


# Single Item Service
This component renders the images for the products with zoom functionality

## Getting Started
```sh
npm run seed
or
docker-compose up
```

## Running the tests

```sh
npm run test
```

## Running server and client locally

```sh
npm start
npm run build
```

## CRUD Operations
| HTTP Verb |           Endpoint          |            Action            |
|-----------| --------------------------- | ---------------------------- |
| **POST**  |         /api/reviews/         |  CREATE a new review in DB   |
| **GET**   |       /api/reviews/:id        |  READ data and return data   |
| **PATCH** |       /api/reviews/:id        |  UPDATE review               |
| **DELETE**|       /api/reviews/:id        |  DELETE review based on ID   |
