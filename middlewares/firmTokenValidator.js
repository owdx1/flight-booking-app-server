const jwt = require('jsonwebtoken');
require('dotenv').config();

const firmTokenValidator = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
      return res.status(401).json({ message: 'User not logged in' });
  }

  jwt.verify(token, process.env.FIRM_TOKEN_SECRET, (err, firm) => {
      if (err) {
          console.log(err);
          //  token süresi geçtiyse, return 401, else return 400
          const statusCode = err.name === 'TokenExpiredError' ? 401 : 400;
          return res.status(statusCode).json({ err });
      }

      

      req.firm = firm; 
      next();
  });
}

module.exports = firmTokenValidator;
