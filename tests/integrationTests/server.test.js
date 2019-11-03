const request = require('supertest');
const app = require('../../src/server/app');

describe('Test the server general functionality', () => {
  test('It should respond to the GET method', done => {
    request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('It should respond with json message property "hello world"', done => {
    request(app)
      .get('/api/v1/helloworld')
      .then(response => {
        expect(response.body.message).toBe('hello world');
        done();
      });
  });

  test('It should respond 404 to the GET wrong url', done => {
    request(app)
      .get('/notarealurlroute')
      .then(response => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});
