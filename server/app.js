import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './swagger.json';

require('dotenv').config();

const corsConfig = {
  origin: ["https://sccofield.github.io"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type']
};

// calling an instance of express
const app = express();
app.use(cors(corsConfig));

// logging all request to console using morgan
app.use(logger('dev'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', router);

app.options("*", cors(corsConfig));


export default app;
