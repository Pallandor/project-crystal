'use strict';
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require(__dirname + '/../../../server');
const mockQuestions = require(__dirname + '/mockData.js');
const each = require('lodash/each');
const request = require('supertest')('http://localhost:3000');
const map = require('lodash/map');
const omit = require('lodash/omit');
const merge = require('lodash/merge');
const Questions = require(__dirname + '/../../../db/index').db.questions;

describe('## Question APIs', function() {

  describe('-- Webpack loading... --', function() {
    before(function(done) {
      // RF: Need alternative to setTimeout in before hook, to account for loadtime.  
      setTimeout(() => { done(); }, 1800);
    });

    describe('# POST /api/v1/questions/add', function() {
      it('It should allow a new question to be added', function(done) {
        const firstQuestion = merge({}, mockQuestions[0]);
        request
          .post('/api/v1/questions/add')
          .send(firstQuestion)
          .expect(httpStatus.OK)
          .end(function(err, res) {
            if (err) return done(err);
            // test expected API response 
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.an('object');
            expect(omit(res.body.data, ['created_at', 'updated_at'])).to.deep.equals(firstQuestion.expected);
            // test database to ensure database state reflects API response
            Questions.findById(firstQuestion.expected.question_id)
              .then(function(foundQuestion) {
                expect(omit(foundQuestion, ['created_at', 'updated_at'])).to.deep.equals(firstQuestion.expected);
                done();
              });
          });
      });

    }); //

    describe('# GET /api/v1/questions/:id', function() {

      it('It should get all existing questions', function(done) {
        const firstQuestion = merge({}, mockQuestions[0]);
        request
          .get('/api/v1/questions')
          .expect(httpStatus.OK)
          .end(function(err, res) {
            if (err) return done(err);
            // test expected API response 
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.an.instanceOf(Array);
            expect(res.body.data).to.have.lengthOf(1);
            expect(omit(res.body.data[0], ['created_at', 'updated_at'])).to.deep.equals(firstQuestion.expected);
            done();
          });
      });

      it('It should get a question by question ID', function(done) {
        const firstQuestion = merge({}, mockQuestions[0]);
        request
          .get('/api/v1/questions/' + firstQuestion.expected.question_id)
          .expect(httpStatus.OK)
          .end(function(err, res) {
            if (err) return done(err);
            // test expected API response
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.an('object');
            expect(omit(res.body.data, ['created_at', 'updated_at'])).to.deep.equals(firstQuestion.expected);
            done();
          });
      });
    }); //
    describe('# DELETE /api/v1/questions/:id', function() {

      it('It should delete a question by question ID', function(done) {
        const firstQuestion = merge({}, mockQuestions[0]);
        request
          .delete('/api/v1/questions/' + firstQuestion.expected.question_id)
          .expect(httpStatus.OK)
          .end(function(err, res) {
            if (err) return done(err);
            // test expected API response 
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.an('object');
            expect(omit(res.body.data, ['created_at', 'updated_at'])).to.deep.equals(firstQuestion.expected);
            // test database to ensure database state reflects API response
            Questions.findById(firstQuestion.expected.question_id)
              .then(function(foundQuestion) {
                expect(foundQuestion).to.not.exist;
                done();
              });
          });
      });
      // additional group tests
    });
    //
  });
});

// });
// });
// });

// });
