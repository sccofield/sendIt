import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import app from '../app';
import pool from '../models/database';

require('dotenv').config();





const generateToken = user => jwt.sign(
  {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  },
  process.env.SECRET,
  { expiresIn: 7200 }
);

chai.use(chaiHttp);

const user1 = {
  firstName: 'michael',
  lastName: 'Umanah',
  username: 'michael123',
  email: 'michael123@test.com',
  password: 'password',
  confirmPassword: 'password'
};


describe('Testing User Controller', () => {
  describe('Testing signup controller', () => {
    const signupUrl = '/api/v1/auth/signup';
    it(
      'should register a new user when all the parameters are given',
      (done) => {
        chai.request(app)
          .post(signupUrl)
          .send(user1)
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(201);
            expect(response.body.data[0]).to.have.property('token');
            expect(response.body.data[0]).to.have.property('user');
            expect(response.body.data[0].user).to.be.a('object');
            expect(response.body.data[0].token).to.be.a('string');
            expect(response.body.data[0].user.email).to.equal(user1.email);
            done();
          });
      }
    );

    it('should not register a user when the email is missing', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          firstName: 'michael',
          lastName: 'Umanah',
          username: 'michael123',
          password: 'password',
          confirmPassword: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not register a user when the first name is missing', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          lastName: 'Umanah',
          username: 'michael123',
          password: 'password',
          confirmPassword: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })


    it('should not register a user when the last name is missing', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          firstName: 'Umanah',
          username: 'michael123',
          password: 'password',
          confirmPassword: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not register a user when the user name is missing', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          email: 'mike234@gmail,com',
          firstName: 'Umanah',
          lastName: 'michael123',
          password: 'password',
          confirmPassword: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not register a user when the password is missing', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          email: 'mike234@gmail,com',
          firstName: 'Umanah',
          lastName: 'michael123',
          username: 'password',
          confirmPassword: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not register a user when the passwords do not match', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          email: 'mike23@gmail.com',
          firstName: 'michael',
          lastName: 'Umanah',
          username: 'michael123',
          password: 'password',
          confirmPassword: 'wrong password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not register a user when the email already exist', (done) => {
      chai.request(app)
        .post(signupUrl)
        .send(user1)
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

  });

  describe('Testing login controller', () => {
    const loginUrl = '/api/v1/auth/login';
    it(
      'should login a new user when all the parameters are given',
      (done) => {
        chai.request(app)
          .post(loginUrl)
          .send(user1)
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(200);
            expect(response.body.data[0]).to.have.property('token');
            expect(response.body.data[0]).to.have.property('user');
            expect(response.body.data[0].user).to.be.a('object');
            expect(response.body.data[0].token).to.be.a('string');
            expect(response.body.data[0].user.email).to.equal(user1.email);
            done();
          });
      }
    );

    it('should not login a user when the email is missing', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          password: 'password',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not login a user when the password is missing', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'mike@gmail.com'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })


    it('should not login a user email does not exist', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'wrongemail@gmail.com',
          password: 'password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })

    it('should not login a user the passsword is wrong', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'mike@gmail.com',
          password: 'wrong password'
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.be.a('string');
          done();
        })
    })


  });


});
