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
      placedBy: 12347,
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
          return response.status(400).json({ error });
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
              message: 'Invalid login details, email or passsword wrong',
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
}

export default ParcelController;
