const errors = require('../errors'),
  logger = require('../logger'),
  Album = require('../models').Album,
  axios = require('axios');

exports.getAllOfAlbumsProvider = () => {
  return axios.get('https://jsonplaceholder.typicode.com/albums').catch(err => {
    logger.error('The request to the albums provider failed');
    throw errors.albumsProviderFail;
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
      logger.error('The request to the albums provider failed');
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

exports.getAlbumsForUserId = (userId, pagination) => {
  return Album.findAll({
    attributes: ['userId', 'albumId', 'title'],
    where: {
      userId
    },
    limit: pagination.limit || 10,
    offset: pagination.offset || 0
  })
    .then(albums => {
      return Album.count({ where: { userId } }).then(count => {
        return { albums, totalCount: count };
      });
    })
    .catch(err => {
      logger.error(`Error in the dataBase, can not select all albums bought by user ${userId}`);
      throw errors.databaseError;
    });
};

exports.getPhotosOfAlbum = id => {
  return axios
    .get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`)
    .then(photos => {
      return photos.data;
    })
    .catch(err => {
      logger.error('The request to the Provider of photos failed');
      throw errors.albumsProviderFail;
    });
};
