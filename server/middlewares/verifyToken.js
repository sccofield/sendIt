import jwt from 'jsonwebtoken';

/**
   * verifies user token
   * @param {object} request express request object
   * @param {object} response express response object
   * @param {object} next express next object
   *
   * @returns {json} json
   */
const verifyToken = (request, response, next) => {
  const { token } = request.headers;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return response.status(401).json({
          status: 401,
          data: {
            message: 'Failed to authenticate token.',
          },
        });
      }
      request.decoded = decoded;
      next();
    });
  } else {
    return response.status(401).json({
      status: 401,
      data: {
        message: 'No token provided.',
      },
    });
  }
};


export default verifyToken;
