/**
   * verifies admin user
   * @param {object} request express request object
   * @param {object} response express response object
   * @param {object} next express next object
   *
   * @returns {json} json
   */
const verifyAdmin = (request, response, next) => {
  if (request.decoded.isAdmin) {
    next();
  } else {
    return response.status(401).json({
      status: 401,
      data: {
        message: 'You are not authorised',
      },
    });
  }
};

export default verifyAdmin;
