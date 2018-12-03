import bcrypt from 'bcryptjs';
import moment from 'moment';

import pool from './database';

require('dotenv').config();

const salt = bcrypt.genSaltSync(10);


const userQuery = `INSERT INTO users(
  firstname,
  lastname,
  email,
  username,
  password,
  registered,
  isAdmin
) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

const data = {
  irstName: 'Mike',
  lastName: 'Umanah',
  email: 'mike@gmail.com',
  username: 'mike',
  password: bcrypt.hashSync('password', salt),
  registered: moment().format(),
  isAdmin: true,

}

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
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      pool.end();
    });

  // eslint-disable-next-line import/no-named-as-default-member
  pool.query(parcels)
    .then((res) => {
      // eslint-disable-next-line no-console
      pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      pool.end();
    });
};

const dropDatabase = () => {
  pool.query('DROP TABLE IF EXISTS parcels, users')
    .then((res) => {
      console.log('database droped')
    })
}

const createAdmin = () => {
  const values = Object.values(data);
  pool.query(userQuery, values, (err, result) => {
    if (err) {
    }
  })
}


module.exports = {
  dropDatabase,
  createTables,
  createAdmin
};

// eslint-disable-next-line import/no-extraneous-dependencies
require('make-runnable');
