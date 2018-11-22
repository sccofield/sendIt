import pool from './database';

const createTables = () => {
  const users = `CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(128) NOT NULL,
      lastname VARCHAR(128) NOT NULL,
      email VARCHAR(128) UNIQUE NOT NULL,
			username VARCHAR(128) NOT NULL,
			password VARCHAR(128) NOT NULL,
      registered DATE NOT NULL,
      isAdmin BOOLEAN
  )`;

  const parcels = `CREATE TABLE IF NOT EXISTS
    parcels(
			id SERIAL PRIMARY KEY,
			placedBy INT NOT NULL,
      weight float8,
      weightmetric VARCHAR(128),
      sentOn DATE,
      deliveredOn DATE,
      status VARCHAR(128),
      fromLocation VARCHAR(128),
      toLocation VARCHAR(128),
      currentLocation VARCHAR(128)
)`;

  // eslint-disable-next-line import/no-named-as-default-member
  pool.query(users)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log('done', res);
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('error', err);
      pool.end();
    });

  // eslint-disable-next-line import/no-named-as-default-member
  pool.query(parcels)
    .then((res) => {
      // eslint-disable-next-line no-console
      console.log('done', res);
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('error', err);
      pool.end();
    });
};


module.exports = {
  createTables,
};

// eslint-disable-next-line import/no-extraneous-dependencies
require('make-runnable');
