exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.invalidEmail = {
  statusCode: 422,
  message: 'Invalid email, it must be a wolox domain.'
};

exports.databaseError = {
  statusCode: 400,
  message: 'Error in the Database'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.invalidCredentials = {
  statusCode: 401,
  message: 'Invalid email or password, check if you wrote it correctly.'
};

exports.invalidPassword = {
  statusCode: 401,
  message: 'Invalid password, check if you wrote it correctly.'
};

exports.noAlbum = {
  statusCode: 404,
  message: 'Invalid Album, the album id does not exist.'
};

exports.alreadyBought = {
  statusCode: 422,
  message: 'The user has already bought the book before.'
};

exports.albumsProviderFail = {
  statusCode: 422,
  message: 'The request to the albums provider failed.'
};

exports.noUserEqual = {
  statusCode: 422,
  message: 'The Id of request is not equal to the user authenticated.'
};

exports.isNotAdmin = {
  statusCode: 422,
  message: 'The user is not an user administrator.'
};

exports.photosOfAlbumsProviderFail = {
  statusCode: 422,
  message: 'The request to the photos of albums provider failed.'
};

exports.noAlbumBought = albumId => {
  return {
    statusCode: 404,
    message: `The user has not bought the album ${albumId} yet.`
  };
};
