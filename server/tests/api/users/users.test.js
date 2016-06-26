'use strict';
// let request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require(__dirname + '/../../../server');
const mockUsers = require(__dirname + '/mockData.js');
const each = require('lodash/each');
const request = require('supertest')('http://localhost:3000');
// chai.config.includeStack = true;  =>  if want to display stack trace

describe('## User APIs', function() {

  describe('# Allow webpack to load before tests using setTimeout', function() {
    before(function(done) {
      // RF: Do DB or table drops on app initialisation
      // RF: Need alternative to setTimeout in before hook, to account for loadtime.  
      setTimeout(() => { done(); }, 1800);
    });

    describe('# POST /api/v1/users/add', function() {
      const user = Object.assign({}, mockUsers.firstUserOfCouple);
      it('It should add a new User and create a new linked Couple', function(done) {
        request
          .post('/api/v1/users/add')
          .send(user)
          .expect(httpStatus.OK)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body.success).to.equal(true);
            expect(res.body.data.email).to.equal(user.email.toLowerCase());
            expect(res.body.data.first_name).to.equal(user.first_name.toLowerCase());
            expect(res.body.data.last_name).to.equal(user.last_name.toLowerCase());
            expect(res.body.data.password).to.equal(undefined);
            expect(res.body.data.couple_id).to.equal(1);
            expect(res.body.data.user_id).to.equal(1);
            expect(res.body.data.score).to.equal(0);
            // Add to account for other properties returning on couple e.g. couple scores
            done();
          });
      });

        it('It should NOT allow a subsequent user to sign up with the same email', function(done) {
        request
          .post('/api/v1/users/add')
          .send(user)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.body.success).to.equal(false);
            done();
          });
      });


    });
  });
});

//     it('It should add a new User and create a new linked Couple', function(done) {
//       request
//         .post('/api/v1/users/add')
//         .send(user)
//         .expect(httpStatus.OK)
//         .end(function(err, res) {
//           if (err) return done(err);
//           expect(res.body.success).to.equal(true);
//           expect(res.body.data.email).to.equal(user.email.toLowerCase());
//           expect(res.body.data.first_name).to.equal(user.first_name.toLowerCase());
//           expect(res.body.data.last_name).to.equal(user.last_name.toLowerCase());
//           expect(res.body.data.password).to.equal(undefined);
//           expect(res.body.data.couple_id).to.equal(1);
//           expect(res.body.data.user_id).to.equal(1);
//           expect(res.body.data.score).to.equal(0);
//           // Add to account for other properties returning on couple e.g. couple scores
//           done();
//         });
//     });
//   });
// });


//   describe('Add firstUserOfCouple', function() {
//     it('should return a HTTP 200 response', function(done) {
//       request(app)
//         .post('/api/v1/users/add')
//         .send(user)
//         .expect(httpStatus.OK)
//         // is the below part needed? 
//         .end(function(err, res) {
//           if (err) return done(err);
//           it('should respond with a success value of true', function(done) {
//             expect(res.body.success).to.equal(true);
//             done();
//           });
//           it('should have true be true, see if this works', function(done) {
//             expect(true).to.equal(true);
//             done();
//           });
//         });
//     });
//   });
// });

// it('should add a new User and generate a new linked Couple', (done) => {
//   request(app)
//     .post('/api/v1/users/add')
//     .send(user)
//     .expect(httpStatus.OK)
//     .end((err, res) => {
//       if (err) return done(err);
//       // expect(res.body.success).to.equal(true);
//       // expect(res.body.data.email).to.equal(user.email.toLowerCase());
//       done();
//     });
// });
// it('should create a new User and a new linked Couple', (done) => {
//   const user = Object.assign({}, mockUsers.firstUserOfCouple);
//   request(app)
//     .post('/api/v1/users/add')
//     .send(user)
//     // .expect(httpStatus.OK)
//     .end((err, res) => {
//       if (err) return done(err);
//       expect(res.body.success).to.equal(true);
//       // expect(res.body.data.email).to.equal(user.email.toLowerCase());
//       done();
//     });
// });


// });

// describe('# GET /api/users/:userId', () => {
//   it('should get user details', (done) => {
//     request(app)
//       .get(`/api/users/${user._id}`)
//       .expect(httpStatus.OK)
//       .then(res => {
//         expect(res.body.username).to.equal(user.username);
//         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
//         done();
//       });
//   });

//   it('should report error with message - Not found, when user does not exists', (done) => {
//     request(app)
//       .get('/api/users/56c787ccc67fc16ccc1a5e92')
//       .expect(httpStatus.NOT_FOUND)
//       .then(res => {
//         expect(res.body.message).to.equal('Not Found');
//         done();
//       });
//   });
// });


// describe('# GET /api/v1/users/', () => {
//   it('should get all users', (done) => {
//     request(app)
//       .get('/api/users')
//       .expect(httpStatus.OK)
//       .then(res => {
//         expect(res.body).to.be.an('array');
//         done();
//       });
//   });
// });


// describe('# PUT /api/users/:userId', () => {
//   it('should update user details', (done) => {
//     user.username = 'KK';
//     request(app)
//       .put(`/api/users/${user._id}`)
//       .send(user)
//       .expect(httpStatus.OK)
//       .then(res => {
//         expect(res.body.username).to.equal('KK');
//         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
//         done();
//       });
//   });
// });

// describe('# DELETE /api/users/', () => {
//   it('should delete user', (done) => {
//     request(app)
//       .delete(`/api/users/${user._id}`)
//       .expect(httpStatus.OK)
//       .then(res => {
//         expect(res.body.username).to.equal('KK');
//         expect(res.body.mobileNumber).to.equal(user.mobileNumber);
//         done();
//       });
//   });
// });
// });
