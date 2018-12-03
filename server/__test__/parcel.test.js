import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import app from '../app';
import pool from '../models/database';

require('dotenv').config();


const user1 = {
  id: 2,
  firstName: 'michael',
  lastName: 'Umanah',
  username: 'michael123',
  email: 'michael123@test.com',
  password: 'password',
  confirmPassword: 'password'
};

const user2 = {
  id: 1,
  firstName: 'michael',
  lastName: 'Umanah',
  username: 'michael123',
  email: 'michael123@test.com',
  password: 'password',
  confirmPassword: 'password',
  isAdmin: true
};


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

describe('Testing Parcel controller', () => {

  describe('API endpoint to add parcel', () => {
    const addParcelUrl = '/api/v1/parcels';
    it('should show a status of 201 when successful', (done) => {
      chai.request(app)
        .post(addParcelUrl)
        .set('token', generateToken(user1))
        .send({
          weight: 23,
          fromLocation: 'Enugu',
          toLocation: 'lagos',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(201);
          expect(response.body.data[0]).to.have.property('id');
          done();
        })
    })
    it('should not be succesful when the weight is not given', (done) => {
      chai.request(app)
        .post(addParcelUrl)
        .set('token', generateToken(user1))
        .send({
          fromLocation: 'Enugu',
          toLocation: 'lagos',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.equal('Please input the parcel weight');
          done();
        })
    })

    it('should not be succesful when the from location is not given', (done) => {
      chai.request(app)
        .post(addParcelUrl)
        .set('token', generateToken(user1))
        .send({
          weight: 23,
          toLocation: 'lagos',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.equal('Please input the from location');
          done();
        })
    })

    it('should not be succesful when the to location is not given', (done) => {
      chai.request(app)
        .post(addParcelUrl)
        .set('token', generateToken(user1))
        .send({
          weight: 23,
          fromLocation: 'lagos',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(400);
          expect(response.body.data[0].message).to.equal('Please input the To location');
          done();
        })
    })

    it('should not be succesful when the token is not set', (done) => {
      chai.request(app)
        .post(addParcelUrl)
        .send({
          weight: 23,
          fromLocation: 'lagos',
        })
        .end((error, response) => {
          expect(response.body).to.be.an('object');
          expect(response.body.status).to.equal(401);
          expect(response.body.data.message).to.equal('No token provided.');
          done();
        })
    })

    describe('API endpoint to get all parcels', () => {
      const getParcelUrl = '/api/v1/parcels';
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .get(getParcelUrl)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(200);
            expect(response.body.data).to.be.a('array');
            done();
          })
      })
      it('should show not be succesful if the user is not an admin', (done) => {
        chai.request(app)
          .get(getParcelUrl)
          .set('token', generateToken(user1))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(401);
            expect(response.body.data.message).to.equal('You are not authorised');
            expect(response.body.data.message).to.be.a('string');
            done();
          })
      })
    })

    describe('API endpoint to get one parcels', () => {
      const getParcelUrl = `/api/v1/parcels/${1}`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .get(getParcelUrl)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(200);
            expect(response.body.data).to.be.a('array');
            done();
          })
      })
    })

    describe('API endpoint to get user parcels', () => {
      const getParcelUrl = `/api/v1/users/${user1.id}/parcels`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .get(getParcelUrl)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(200);
            expect(response.body.data).to.be.a('array');
            done();
          })
      })

      it('should return an error if the user has no parcel', (done) => {
        chai.request(app)
          .get(`/api/v1/users/${user2.id}/parcels`)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            expect(response.body.data).to.be.a('array');
            expect(response.body.data[0].message).to.equal('The user has no parcel order');
            done();
          })
      })
    })

    describe('API endpoint to get cancel parcel order', () => {
      const cancelParcelUrl = `/api/v1/parcels/1/cancel`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .put(cancelParcelUrl)
          .set('token', generateToken(user1))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(201);
            expect(response.body.data.message).to.equal('Order cancelled succesfully');
            done();
          })
      })

      it('should return an error if parcel does not exist', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/noparcel/cancel`)
          .set('token', generateToken(user1))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })
    })

    describe('API endpoint to change status of parcel order', () => {
      const statusParcelUrl = `/api/v1/parcels/1/status`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .put(statusParcelUrl)
          .set('token', generateToken(user2))
          .send({
            status: 'Transit'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(201);
            expect(response.body.data.message).to.equal('status changed');
            done();
          })
      })

      it('should return an error if parcel does not exist', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/345/status`)
          .set('token', generateToken(user2))
          .send({
            status: 'Transit'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })

      it('should return an error if the status is not given', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/345/status`)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })
    })

    describe('API endpoint to change location of parcel order', () => {
      const locationParcelUrl = `/api/v1/parcels/1/currentlocation`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .put(locationParcelUrl)
          .set('token', generateToken(user2))
          .send({
            currentLocation: 'Abuja'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(201);
            expect(response.body.data.message).to.equal('Current Location changed');
            done();
          })
      })

      it('should return an error if parcel does not exist', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/345/currentlocation`)
          .set('token', generateToken(user2))
          .send({
            currentLocation: 'Abuja'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })

      it('should return an error if the location is not given', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/1/currentlocation`)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })
    })

    describe('API endpoint to change destination of parcel order', () => {
      const destinationParcelUrl = `/api/v1/parcels/1/destination`;
      it('should show a status of 201 when successful', (done) => {
        chai.request(app)
          .put(destinationParcelUrl)
          .set('token', generateToken(user1))
          .send({
            toLocation: 'Abuja'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(201);
            expect(response.body.data.message).to.equal('Destination changed');
            done();
          })
      })

      it('should return an error if parcel does not exist', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/345/destination`)
          .set('token', generateToken(user1))
          .send({
            toLocation: 'Abuja'
          })
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })

      it('should return an error if the location is not given', (done) => {
        chai.request(app)
          .put(`/api/v1/parcels/345/destination`)
          .set('token', generateToken(user2))
          .end((error, response) => {
            expect(response.body).to.be.an('object');
            expect(response.body.status).to.equal(400);
            done();
          })
      })
    })

  })
})
