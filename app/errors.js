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
  statusCode: 401,
  message: 'The user has already bought the book before.'
};
