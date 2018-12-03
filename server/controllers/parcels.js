import moment from 'moment';
import pool from '../models/database';

/**
 * @class ParcelController
 */
class ParcelController {
  /**
   * creates a new parcel order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static addParcels(request, response) {
    if (!request.body.weight) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input the parcel weight',
        }],
      });
    }
    if (!request.body.fromLocation) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input the from location',
        }],
      });
    }
    if (!request.body.toLocation) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'Please input the To location',
        }],
      });
    }
    const data = {
      placedBy: request.decoded.id,
      weight: request.body.weight,
      weightmetric: 'kg',
      sentOn: moment().format(),
      status: 'placed',
      fromLocation: request.body.fromLocation,
      toLocation: request.body.toLocation,
      currentLocation: request.body.fromLocation,
    };

    pool.connect((err, client, done) => {
      const query = `INSERT INTO parcels(
        placedBy,
        weight,
        weightmetric,
        sentOn,
        status,
        fromLocation,
        toLocation,
        currentLocation
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
      const values = Object.values(data);

      client.query(query, values, (error, result) => {
        done();
        if (error) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: 'error',
            }],
          });
        }
        return response.status(201).json({
          status: 201,
          data: [{
            message: 'Order created',
            id: result.rows[0].id,
          }],
        });
      });
    });
  }

  /**
   * Get all parcel orders
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static getAllOrders(request, response) {
    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM parcels';
      client.query(query, (error, result) => {
        done();
        if (error) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: 'error',
            }],
          });
        }
        return response.status(200).json({
          status: 200,
          data: result.rows,
        });
      });
    });
  }

  /**
   * Get all specific parcel deliver order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static getOrder(request, response) {
    const { parcelId } = request.params;
    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM parcels WHERE id =$1';
      const values = [parcelId];
      client.query(query, values, (error, result) => {
        done();
        if (error) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        const recipe = result.rows[0];
        if (!recipe) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        return response.status(200).json({
          status: 200,
          data: result.rows,
        });
      });
    });
  }

  /**
   * Get all users parcel deliver order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static getUserOrders(request, response) {
    const { userId } = request.params;
    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM parcels WHERE placedBy =$1';
      const values = [userId];
      client.query(query, values, (error, result) => {
        done();
        if (error) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `User with the id ${userId} does not exist`,
            }],
          });
        }
        const recipe = result.rows[0];
        if (!recipe) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: 'The user has no parcel order',
            }],
          });
        }
        return response.status(200).json({
          status: 200,
          data: result.rows,
        });
      });
    });
  }

  /**
   * Cancel parcel deliver order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static cancelOrder(request, response) {
    const { parcelId } = request.params;
    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM parcels WHERE id =$1';
      const values = [parcelId];
      client.query(query, values, (error, result) => {
        done();
        if (error || result.rows.length === 0) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        const recipe = result.rows[0];
        if (recipe.placedby !== request.decoded.id) {
          return response.status(401).json({
            status: 401,
            data: [{
              message: 'You don\'t have permission to cancel that order',
            }],
          });
        }
        client.query('UPDATE parcels set status=$1 where id=$2',
          ['cancelled', parcelId], (updateError, updateResult) => {
            done();
            if (updateError) {
              return response.status(400).json({
                status: 400,
                data: [{
                  message: err,
                }],
              });
            }
            return response.status(201).json({
              status: 201,
              data: {
                message: 'Order cancelled succesfully',
              },
            });
          });
      });
    });
  }

  /**
   * Change destination of order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static changeDestination(request, response) {
    const { parcelId } = request.params;
    pool.connect((err, client, done) => {
      const query = 'SELECT * FROM parcels WHERE id =$1';
      const values = [parcelId];
      client.query(query, values, (error, result) => {
        done();
        if (error || result.rows.length === 0) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        const recipe = result.rows[0];
        if (recipe.status === 'delivered' || recipe.status === 'cancelled') {
          return response.status(401).json({
            status: 401,
            data: [{
              message: 'You can no longer change the destination of this order',
            }],
          });
        }
        if (recipe.placedby !== request.decoded.id) {
          return response.status(401).json({
            status: 401,
            data: [{
              message: 'You don\'t have permission to change destination of this order',
            }],
          });
        }
        client.query('UPDATE parcels set toLocation=$1 where id=$2 RETURNING id, toLocation',
          [request.body.toLocation, parcelId], (updateError, updateResult) => {
            done();
            if (updateError) {
              return response.status(400).json({
                status: 400,
                data: [{
                  message: updateError,
                }],
              });
            }
            return response.status(201).json({
              status: 201,
              data: {
                id: updateResult.rows[0].id,
                to: updateResult.rows[0].tolocation,
                message: 'Destination changed',
              },
            });
          });
      });
    });
  }

  /**
   * Set current location of order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static setLocation(request, response) {
    const { currentLocation } = request.body;
    const { parcelId } = request.params;
    if (!currentLocation) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'PLease input current location',
        }],
      });
    }
    pool.connect((err, client, done) => {
      const query = 'UPDATE parcels set currentLocation=$1 where id=$2 RETURNING id, currentLocation';
      const values = [currentLocation, parcelId];
      client.query(query, values, (error, result) => {
        done();
        if (error || result.rows.length === 0) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        return response.status(201).json({
          status: 201,
          data: {
            id: result.rows[0].id,
            currentLocation: result.rows[0].currentlocation,
            message: 'Current Location changed',
          },
        });
      });
    });
  }

  /**
   * Change status of parcel order
   * @param {object} request express request object
   * @param {object} response express response object
   *
   * @returns {json} json
   * @memberof ParcelController
   */
  static changeStatus(request, response) {
    const { status } = request.body;
    const { parcelId } = request.params;
    if (!status) {
      return response.status(400).json({
        status: 400,
        data: [{
          message: 'PLease input status',
        }],
      });
    }
    pool.connect((err, client, done) => {
      const query = 'UPDATE parcels set status=$1 where id=$2 RETURNING id, status';
      const values = [status, parcelId];
      client.query(query, values, (error, result) => {
        done();
        if (error || result.rows.length === 0) {
          return response.status(400).json({
            status: 400,
            data: [{
              message: `Parcel with the id ${parcelId} does not exist`,
            }],
          });
        }
        return response.status(201).json({
          status: 201,
          data: {
            id: result.rows[0].id,
            status: result.rows[0].status,
            message: 'status changed',
          },
        });
      });
    });
  }
}

export default ParcelController;
