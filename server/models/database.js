import { Pool } from 'pg';

require('dotenv').config();
let DATABASE_URL

if (process.env.NODE_ENV === 'TEST') {
  DATABASE_URL = process.env.DATABASE_URL_TEST
} else {
  DATABASE_URL = process.env.DATABASE_URL
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to the db');
});


// pool.on('remove', () => {
//   // eslint-disable-next-line no-console
//   console.log('client removed');
//   process.exit(0);
// });

export default pool;
