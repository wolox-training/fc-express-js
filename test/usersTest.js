const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  should = chai.should();

chai.use(chaiHttp);

describe('/users POST', () => {
  it('Should fail because name is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        surname: 'Coronel',
        email: 'franco.coronel@wolox.com.ar',
        password: '123456789'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should fail because surname is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Coronel',
        email: 'franco.coronel@wolox.com.ar',
        password: '123456789'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should fail because password is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Franco',
        surname: 'Coronel',
        email: 'franco.coronel@wolox.com.ar'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should fail because email is missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Franco',
        surname: 'Coronel',
        password: '123456789'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should fail because email is in use', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Franco',
        surname: 'Coronel',
        email: 'franco.coronel@wolox.com.ar',
        password: '123456789'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should fail because the password hasnt 8 characters or more ', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Franco',
        surname: 'Coronel',
        email: 'franco.coronel@wolox.com.ar',
        password: '1234'
      })
      .catch(err => {
        err.should.have.status(422);
      })
      .then(() => done());
  });

  it('Should be successful', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Franco',
        surname: 'Coronel',
        email: 'franco.coronel@wolox.com.ar',
        password: '123456789'
      })
      .then(res => {
        res.should.have.status(201);
        dictum.chai(res);
      })
      .then(() => done());
  });
});
