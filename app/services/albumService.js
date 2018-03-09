const errors = require('../errors'),
  axios = require('axios');

exports.getAllOfAlbumsProvider = () => {
  return axios.get('https://jsonplaceholder.typicode.com/albums').catch(err => {
    throw err;
  });
};
