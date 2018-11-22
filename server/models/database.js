import { Pool } from 'pg';

require('dotenv').config();

const pool = new Pool({
  connectionString: 'postgresql://localhost/send-it?user=admin&password=admin',
});

pool.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log('connected to the db');
});


pool.on('remove', () => {
  // eslint-disable-next-line no-console
  console.log('client removed');
  process.exit(0);
});

export default pool;
