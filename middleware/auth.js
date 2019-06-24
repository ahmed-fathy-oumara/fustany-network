const jwt = require('jsonwebtoken');
const config = require('config');

//middleware function that takes request object, response object 
//and next callback to move to the next middleware:
module.exports = function (req, res, next) {

  //Get token from header using request
  const token = req.header('x-auth-token');

  // Check if not token using response
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //verify token using next
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};