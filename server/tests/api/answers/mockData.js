// Mock data and setup functions for API Answers Test Suite

const request = require('supertest')('http://localhost:3000');
const mockUsers = require('./../users/mockData');
const Promise = require('bluebird');
const merge = require('lodash/merge');
const Questions = require(__dirname + '/../../../db/index').db.questions;

exports.users = [{}];

exports.setup = () => {
  return new Promise((resolve, reject) => {
    request
      .post('/api/v1/users/add')
      .send(merge({}, mockUsers.firstUserOfCouple))
      .end(function(err, res) {
        const firstUser = res.body.data;
        request
          .post('/api/v1/users/add')
          .send(merge({}, mockUsers.secondUserOfCouple))
          .end(function(err, res) {
            const secondUser = res.body.data;
            Questions.init()
              .then(() => {
                resolve({ firstUser, secondUser });
              })
              .catch(err => reject(err));
          });
      })

  });
};
