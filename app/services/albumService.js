const errors = require('../errors'),
  Album = require('../models').Album,
  axios = require('axios');

exports.getAllOfAlbumsProvider = () => {
  return axios.get('https://jsonplaceholder.typicode.com/albums').catch(err => {
    throw err;
  });
};

exports.getOneAlbum = id => {
  return axios
    .get(`https://jsonplaceholder.typicode.com/albums?id=${id}`)
    .then(albums => {
      // The album provider always returns an array of albums, so I return the first
      return albums.data[0];
    })
    .catch(err => {
      throw errors.noAlbum;
    });
};

exports.getAlbum = (userId, albumId) => {
  return Album.findOne({
    where: { userId, albumId }
  }).catch(err => {
    throw errors.databaseError;
  });
};

exports.create = (userId, title, albumId) => {
  return Album.create({ userId, title, albumId }).catch(err => {
    throw errors.databaseError;
  });
};
