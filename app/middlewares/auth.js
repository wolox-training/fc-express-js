const sessionManager = require('./../services/sessionManager'),
  moment = require('moment'),
  logger = require('../logger'),
  User = require('../models').User;

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const payload = sessionManager.decode(auth);
    User.findOne({ where: { email: payload.email } }).then(userAuthenticated => {
      if (!userAuthenticated || payload.numberOfValidToken !== userAuthenticated.validToken) {
        res.status(401).send({ message: 'User is not authenticated' });
      } else {
        if (payload.expirationTime <= moment().unix()) {
          logger.error(`The user ${userAuthenticated.dataValues.email} can not log in, token expired`);
          return res.status(401).send({ message: 'Token expired' });
        }
        req.userAuthenticated = userAuthenticated;
        req.isAdmin = true;
        req.tokenExpirationDate = payload.expirationTime;
        next();
      }
    });
  } else {
    res.status(401);
    res.send({ message: 'Your request hasnt authorization header' });
  }
};
