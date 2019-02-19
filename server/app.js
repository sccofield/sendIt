import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.json';

require('dotenv').config();

// calling an instance of express
const app = express();
app.use(cors());

// logging all request to console using morgan
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', router);

export default app;
