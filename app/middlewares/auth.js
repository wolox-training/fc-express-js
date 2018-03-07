const sessionManager = require('./../services/sessionManager'),
  User = require('../models').User;

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (!auth) {
    return res.status(401).send({ message: 'Your request hasnt authorization header' });
  }
  next();
};
