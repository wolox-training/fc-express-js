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
  let request, userCreation, user, album2;
  beforeEach(done => {
    request = chai.request(server).post('/albums/1');
    userCreation = User.create({
      name: 'Franco',
      surname: 'Coronel',
      email: 'franco.coronel@wolox.com.ar',
      password: 'passwordFC'
    }).then(newUser => {
      user = newUser;
      Album.create({ userId: user.id, albumId: 2, title: 'title test' }).then(albumCreated => {
        album2 = albumCreated.albumId;
        done();
      });
    });
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
    });
  });

  it('should return error for album with id 105 because the album does not exist', done => {
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
    });
  });

  it('should return error for album with id 2 because the album has been already bought', done => {
    const albumsNock = nock('https://jsonplaceholder.typicode.com')
      .get(`/albums?id=${album2}`)
      .reply(200, [
        {
          userId: '1',
          albumId: '2',
          title: 'sunt qui excepturi placeat culpa'
        }
      ]);
    successfullLogin().then(loginRes => {
      chai
        .request(server)
        .post(`/albums/${album2}`)
        .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
        .catch(err => {
          err.should.have.status(422);
          err.response.should.be.json;
          err.response.body.should.have.property('error');
          done();
        });
    });
  });
});
