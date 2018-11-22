import jwt from 'jsonwebtoken';

const verifyToken = (request, response, next) => {
  const { token } = request.headers;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return response.status(401).json({
          status: 'Error',
          message: 'Failed to authenticate token.',
        });
      }
      request.decoded = decoded;
      next();
    });
  } else {
    return response.status(401).json({
      status: 'Error',
      message: 'No token provided.',
    });
  }
};


export default verifyToken;
