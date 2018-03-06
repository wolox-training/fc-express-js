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
  message: 'Error en la BD'
};

exports.defaultError = message => {
  return {
    statusCode: 500,
    message
  };
};

exports.invalidUser = {
  statusCode: 422,
  message: 'Invalid email or password, check if you wrote it correctly.'
};
