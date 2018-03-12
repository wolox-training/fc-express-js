const errors = require('../errors'),
  logger = require('../logger'),
  axios = require('axios');

exports.getAllOfAlbumsProvider = () => {
  return axios.get('https://jsonplaceholder.typicode.com/albums').catch(err => {
    logger.error('The request to the albums provider failed');
    throw errors.albumsProviderFail;
  });
};
