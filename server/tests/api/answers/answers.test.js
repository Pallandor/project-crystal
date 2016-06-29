'use strict';
const httpStatus = require('http-status');
const chai = require('chai');
const expect = chai.expect;
const app = require(__dirname + '/../../../server');
const each = require('lodash/each');
const request = require('supertest')('http://localhost:3000');
const map = require('lodash/map');
const omit = require('lodash/omit');
const merge = require('lodash/merge');
const Questions = require(__dirname + '/../../../db/index').db.questions;
const Answers = require(__dirname + '/../../../db/index').db.answers;
const mockAnswers = require(__dirname + '/mockData.js');

describe('## Answers APIs', function() {

  describe('-- Webpack loading... --', function() {
    before(function(done) {
      // RF: Need alternative to setTimeout in before hook, to account for loadtime.  
      // Populate questions table with a few questions, not async-ly

      setTimeout(() => {
        done();
      }, 1800);
    });

    describe('# POST /api/v1/answers/add', function() {
      it('It should add a new answer', function(done) {
        mockAnswers.setup()
          .then(twoUsers => {
            request
              .post('/api/v1/answers/add')
              .send({
                question_id: 1,
                user_id: twoUsers.secondUser.user_id,
                couple_id: twoUsers.secondUser.couple_id,
                answer_text: 'i love the other personn sooo much!!!',
              })
              .end(function(err, res) {
                if (err) done(err);
                expect(res.body.success).to.equal(true);
                expect(res.body.data.answer_id).to.equal(1);
                expect(res.body.data.answer_text).to.equal('i love the other personn sooo much!!!');
                done();
              });
          })
          .catch(err => done(err));
      });
    }); //

    // Urgent RF: Hardcoded 1 value in POST-URI.
    describe('# GET /api/v1/answers/couples/:coupleId', function() {
      it('It should get all answers for a particular couple', function(done) {
        request
          .get('/api/v1/answers/couples/' + 1)
          .end(function(err, res) {
            if (err) done(err);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.instanceOf(Array);
            // expect(res.body.data[0]).to.equal('i love the other personn sooo much!!!'); 
            done();
          });
      });
    });



    // RF: Add more answers from other users before this test, similarly above. Otherwise could
    // be retrieving all answers, and would not know the difference here if db is only populated with
    // a single answer. 
    describe('# GET /api/v1/answers/users/:userId', function() {
      it('It should get all answers for a particular user', function(done) {
        request
          .get('/api/v1/answers/users/' + 2)
          .end(function(err, res) {
            if (err) done(err);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.instanceOf(Array);
            expect(res.body.data).to.have.a.lengthOf(1);
            expect(res.body.data[0]).to.have.all.keys(['answer_id', 'user_id', 'couple_id', 'question_id', 'answer_text', 'created_at', 'updated_at']);
            done();
          });
      });
    });

     describe('# DELETE /api/v1/answers/:answerId', function() {
      it('It should delete an answer', function(done) {
        request
          .delete('/api/v1/answers/' + 1)
          .end(function(err, res) {
            if (err) done(err);
            expect(res.body.success).to.equal(true);
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.answer_id).to.equal(1);
            Answers.findById(1)
              .then(function(foundAnswer){
                expect(foundAnswer).to.not.exist; 
                done(); 
              })
              .catch(function(err){
                done(err); 
              });

          });
      });
    });

    // add more describe tests

  });
});