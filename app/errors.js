exports.notFound = {
  statusCode: 404,
  message: 'Not found'
};

exports.invalidEmail = {
  statusCode: 422,
  message: 'Invalid email, it must be a wolox domain.'
};

exports.databaseError = error => {
  return {
    statusCode: 400,
    message: error.message
  };
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};
