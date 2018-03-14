const chai = require('chai'),
  chaiHttp = require('chai-http'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  should = chai.should(),
  nock = require('nock'),
  Album = require('./../app/models').Album,
  sessionManager = require('./../app/services/sessionManager'),
  User = require('./../app/models').User;

chai.use(chaiHttp);

const successfullLogin = () => {
  return chai
    .request(server)
    .post('/users/session')
    .send({ email: 'franco.coronel@wolox.com.ar', password: 'passwordFC' });
};

describe('/albums GET', () => {
  let request;
  beforeEach(done => {
    request = chai.request(server).get('/albums');
    done();
  });

  it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent`, done => {
    request.catch(err => err.should.have.status(401));
    done();
  });

  it('should return all albums', done => {
    const albumsNock = nock('https://jsonplaceholder.typicode.com')
      .get('/albums')
      .reply(200, [
        {
          userId: '1',
          id: '1',
          title: 'quidem molestiae enim'
        }
      ]);
    User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(
      successfullLogin().then(loginRes => {
        request.set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME]).then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.array;
          res.body.should.have.lengthOf(1);
          res.body[0].should.have.property('userId');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('title');
          dictum.chai(res);
          done();
        });
      })
    );
  });
});

describe('/albums/:id POST', () => {
  let request;
  beforeEach(done => {
    request = chai.request(server).post('/albums/1');
    done();
  });

  it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent`, done => {
    request.catch(err => err.should.have.status(401));
    done();
  });

  it('should buy an album with id 1', done => {
    const albumsNock = nock('https://jsonplaceholder.typicode.com')
      .get('/albums?id=1')
      .reply(200, [
        {
          userId: '1',
          albumId: '1',
          title: 'quidem molestiae enim'
        }
      ]);
    User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(
      successfullLogin().then(loginRes => {
        request.set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME]).then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('userId');
          res.body.should.have.property('title');
          res.body.should.have.property('albumId');
          dictum.chai(res);
          done();
        });
      })
    );
  });

  it('should return error for album with id 105 because the album does not exist', done => {
    User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(
      successfullLogin().then(loginRes => {
        chai
          .request(server)
          .post('/albums/105')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            err.should.have.status(404);
            err.response.should.be.json;
            err.response.body.should.have.property('error');
            done();
          });
      })
    );
  });

  it('should return error for album with id 1 because the album has been already bought', done => {
    User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(
      successfullLogin().then(loginRes => {
        request
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(albumBought => {
            chai
              .request(server)
              .post('/albums?id=1')
              .catch(err => {
                err.should.have.status(404);
                err.response.should.be.json;
                err.response.body.should.have.property('message');
                done();
              });
          });
      })
    );
  });
});

describe('/users/:user_id/albums GET', () => {
  let request;
  let user;
  beforeEach(done => {
    User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      user = newUser;
      Album.create({ userId: user.id, albumId: 1, title: 'title test' }).then(() => {
        Album.create({ userId: user.id, albumId: 2, title: 'title test 2' }).then(() => {
          request = chai.request(server).get(`/users/${user.id}/albums`);
          done();
        });
      });
    });
  });

  it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent`, done => {
    request.catch(err => {
      err.should.have.status(401);
      done();
    });
  });

  it('should return all albums bought', done => {
    successfullLogin().then(loginRes => {
      request.set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME]).then(res => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('albums');
        res.body.albums.should.be.array;
        res.body.albums.should.have.lengthOf(2);
        res.body.albums[0].should.have.property('albumId');
        res.body.albums[0].should.have.property('title');
        res.body.albums[0].should.have.property('userId');
        dictum.chai(res);
        done();
      });
    });
  });
});
