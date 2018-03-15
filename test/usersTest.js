const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  should = chai.should(),
  sessionManager = require('./../app/services/sessionManager'),
  mockDate = require('mockdate'),
  moment = require('moment'),
  User = require('./../app/models').User;

chai.use(chaiHttp);

const successfullLogin = (email, password) => {
  return chai
    .request(server)
    .post('/users/session')
    .send({ email, password });
};

describe('/users/session POST', () => {
  let request;
  let userCreation;
  beforeEach(done => {
    request = chai.request(server).post('/users/session');
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      done();
    });
  });

  it('should fail login because of invalid email', done => {
    userCreation.then(afterCreation => {
      request.send({ email: 'invalid', password: 'passwordFC' }).catch(err => {
        err.should.have.status(401);
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
          err.should.have.status(401);
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
          password: 'passwordFC'
        })
        .then(res => {
          res.should.have.status(200);
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
          password: 'passwordFC'
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
          password: 'passwordFC'
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
          password: 'passwordFC'
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
          password: 'passwordFC'
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
          password: 'passwordFC'
        })
        .then(res => {
          res.should.have.status(201);
          User.count().then(newCount => {
            newCount.should.be.equal(oldCount + 1);
            User.findOne({ where: { email: 'franco.coronel@wolox.com.ar' } }).then(user => {
              user.should.be.present;
              user.name.should.be.equal('Franco');
              user.password.should.not.be.equal('passwordFC');
            });
            dictum.chai(res);
            done();
          });
        });
    });
  });
});

describe('/users GET', () => {
  let request;
  let userCreation;
  beforeEach(done => {
    request = chai.request(server).get('/users');
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      done();
    });
  });

  it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent`, done => {
    request.catch(err => {
      err.should.have.status(401);
      done();
    });
  });

  it('should return all users', done => {
    userCreation.then(
      successfullLogin('franco.coronel@wolox.com.ar', 'passwordFC').then(loginRes => {
        request.set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME]).then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('users');
          res.body.users.should.be.array;
          res.body.users.should.have.lengthOf(1);
          res.body.users[0].should.have.property('name');
          res.body.users[0].should.have.property('surname');
          res.body.users[0].should.have.property('email');
          dictum.chai(res);
          done();
        });
      })
    );
  });
});

describe('/admin/users POST', () => {
  let userAdminRequest;
  let userCreation;
  beforeEach(done => {
    userAdminRequest = chai
      .request(server)
      .post('/admin/users')
      .send({
        name: 'Franco',
        surname: 'Perez',
        email: 'franco.perez@wolox.com.ar',
        password: 'passwordFP'
      });
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      done();
    });
  });

  it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent`, done => {
    userAdminRequest.catch(err => {
      err.should.have.status(401);
      done();
    });
  });

  it(`should fail because is not an admin user`, done => {
    const AdmiUuserCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC',
      isAdmin: true
    }).then(
      successfullLogin('franco.coronel@wolox.com.ar', 'passwordFC').then(loginRes => {
        User.count().then(oldCount => {
          userAdminRequest
            .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
            .catch(err => {
              err.should.have.status(401);
              err.response.should.be.json;
              err.response.body.should.have.property('error');
              User.count().then(newCount => {
                newCount.should.be.equal(oldCount);
                done();
              });
            });
        });
      })
    );
  });

  it('should create an admin user', done => {
    const AdminuserCreation = User.create({
      name: 'Matias',
      surname: 'Pizzagalli',
      email: 'matias.pizzagalli@wolox.com.ar',
      password: 'passwordMP',
      isAdmin: true
    }).then(newUser => {
      successfullLogin(newUser.email, 'passwordMP').then(loginRes => {
        User.count().then(oldCount => {
          userAdminRequest
            .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
            .then(res => {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.have.property('name');
              res.body.should.have.property('surname');
              res.body.should.have.property('email');
              res.body.should.have.property('isAdmin');
              User.count().then(newCount => {
                newCount.should.be.equal(oldCount + 1);
                User.findOne({ where: { email: 'franco.perez@wolox.com.ar' } }).then(user => {
                  user.should.be.present;
                  user.name.should.be.equal('Franco');
                  user.surname.should.be.equal('Perez');
                  user.password.should.not.be.equal('passwordFP');
                  user.isAdmin.should.be.equal(true);
                });
                dictum.chai(res);
                done();
              });
            });
        });
      });
    });
  });
});

describe('Token expired /users GET', () => {
  let request;
  let userCreation;
  beforeEach(done => {
    request = chai.request(server).get('/users');
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      done();
    });
  });

  it('should fail because token expired', done => {
    userCreation.then(
      successfullLogin('franco.coronel@wolox.com.ar', 'passwordFC').then(loginRes => {
        mockDate.set(moment().add(1, 'days'));
        request.set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME]).catch(err => {
          err.response.should.have.status(401);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          mockDate.reset();
          done();
        });
      })
    );
  });
});

