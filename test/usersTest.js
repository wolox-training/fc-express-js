const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  should = chai.should(),
  sessionManager = require('./../app/services/sessionManager'),
  User = require('./../app/models').User;

chai.use(chaiHttp);

describe('/users/session POST', () => {
  let request;
  let userCreation;
  beforeEach(done => {
    request = chai.request(server).post('/users/session');
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: '123456789'
    });
    done();
  });

  it('should fail login because of invalid email', done => {
    userCreation.then(afterCreation => {
      request.send({ email: 'invalid', password: '123456789' }).catch(err => {
        err.should.have.status(422);
        err.response.should.be.json;
        err.response.body.should.have.property('error');
        done();
      });
    });
  });

  it('should fail login because of invalid password', done => {
    userCreation.then(afterCreation => {
      request
        .send({
          email: 'franco.coronel@wolox.com.ar',
          password: 'invalid'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
  });

  it('Log in Should be successful', done => {
    userCreation.then(afterCreation => {
      request
        .send({
          email: 'franco.coronel@wolox.com.ar',
          password: '123456789'
        })
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('name');
          res.body.should.have.property('surname');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.headers.should.have.property(sessionManager.HEADER_NAME);
          dictum.chai(res);
          done();
        });
    });
  });
});

describe('/users POST', () => {
  let request;
  beforeEach(done => {
    request = chai.request(server).post('/users');
    done();
  });

  it('Should fail because name is missing', done => {
    User.count().then(oldCount => {
      request
        .send({
          surname: 'Coronel',
          email: 'franco.coronel@wolox.com.ar',
          password: '123456789'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });

  it('Should fail because surname is missing', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          email: 'franco.coronel@wolox.com.ar',
          password: '123456789'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });

  it('Should fail because password is missing', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          surname: 'Coronel',
          email: 'franco.coronel@wolox.com.ar'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });

  it('Should fail because email is missing', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          surname: 'Coronel',
          password: '123456789'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });

  it('Should fail because email is in use', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          surname: 'Coronel',
          email: 'franco.coronel@wolox.com',
          password: '123456789'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });
  it('Should fail because the password hasnt 8 characters or more ', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          surname: 'Coronel',
          email: 'franco.coronel@wolox.com.ar',
          password: '1234'
        })
        .catch(err => {
          err.should.have.status(422);
          err.should.have.property('message');
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount);
            done();
          });
        });
    });
  });

  it('Should be successful', done => {
    User.count().then(oldCount => {
      request
        .send({
          name: 'Franco',
          surname: 'Coronel',
          email: 'franco.coronel@wolox.com.ar',
          password: '123456789'
        })
        .then(res => {
          res.should.have.status(201);
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount + 1);
            User.findOne({ where: { email: 'franco.coronel@wolox.com.ar' } }).then(user => {
              user.should.be.present;
              user.name.should.be.equal('Franco');
              user.password.should.not.be.equal('123456789');
            });
            dictum.chai(res);
            done();
          });
        });
    });
  });
});
