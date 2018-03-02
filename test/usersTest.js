const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  should = chai.should(),
  User = require('./../app/models').User;

chai.use(chaiHttp);

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
          name: 'Coronel',
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
