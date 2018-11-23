import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import pool from '../models/database';

require('dotenv').config();


const salt = bcrypt.genSaltSync(10);


const secret = process.env.SECRET;

/**
 * @class UserController
 */
class UserController {
  /**
   * creates new user
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof UserController
   */
  static signup(request, response) {
    if (!request.body.firstName) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input your first name',
        }],
      });
    }
    if (!request.body.lastName) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input your last name',
        }],
      });
    }
    if (!request.body.email) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input your email',
        }],
      });
    }
    if (!request.body.username) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input your username',
        }],
      });
    }
    if (!request.body.password) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input your password',
        }],
      });
    }
    if (request.body.password !== request.body.confirmPassword) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please passwords do not match',
        }],
      });
    }
    const data = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      username: request.body.username,
      password: bcrypt.hashSync(request.body.password, salt),
      registered: moment().format(),
      isAdmin: false,
    };

    pool.connect((err, client, done) => {
      const query = `INSERT INTO users(
        firstname,
        lastname,
        email,
        username,
        password,
        registered,
        isAdmin
      ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const values = Object.values(data);

      client.query(query, values, (error, result) => {
        done();
        if (error) {
          if (error.code === '23505') {
            return response.status(400).json({
              status: 400,
              data: [{
                message: 'Email already exist',
              }],
            });
          }
          return response.status(400).json({
            status: 400,
            data: [{
              error,
            }],
          });
        }
        const user = result.rows[0];
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        }, secret);
        const { password, registered, ...userdata } = user;

        return response.status(201).json({
          status: 201,
          data: [{
            token,
            user: userdata,
          }],
        });
      });
    });
  }

  /**
   * login user
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof UserController
   */
  static login(request, response) {
    if (!request.body.email) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input the email',
        }],
      });
    }
    if (!request.body.password) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input the password',
        }],
      });
    }

    const data = {
      email: request.body.email,
      password: request.body.password,
    };

    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [data.email];
      client.query(query, values, (error, result) => {
        done();
        const user = result.rows[0];
        if (!user) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: 'Invalid login details, email or passsword wrong',
            }],
          });
        }
        if (bcrypt.compareSync(data.password, user.password)) {
          const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isadmin,
          }, secret);
          const { password, registered, ...userdata } = user;
          return response.status(200).json({
            status: 200,
            data: [{
              token,
              user: userdata,
            }],
          });
        }
        return response.status(400).json({
          status: 400,
          data: [{
            message: 'Invalid login details, email or passsword wrong',
          }],
        });
      });
    });
  }
}

export default UserController;
