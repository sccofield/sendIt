import { Router } from 'express';
import Parcels from '../controllers/parcels';
import Users from '../controllers/users';
import verifyToken from '../middlewares/verifyToken';
import verifyAdmin from '../middlewares/verifyAdmin';

const router = Router();

router.get('/', (req, res) => {
  res.send('hello sendit');
});

router.post('/parcels', verifyToken, Parcels.addParcels);

router.post('/auth/signup', Users.signup);

router.post('/auth/login', Users.login);

router.get('/parcels', verifyToken, verifyAdmin, Parcels.getAllOrders);

router.get('/parcels/:parcelId', Parcels.getOrder);

router.get('/users/:userId/parcels', Parcels.getUserOrders);

router.put('/parcels/:parcelId/cancel', verifyToken, Parcels.cancelOrder);

router.put('/parcels/:parcelId/destination',
  verifyToken,
  Parcels.changeDestination);

router.put('/parcels/:parcelId/currentlocation',
  verifyToken,
  verifyAdmin,
  Parcels.setLocation);

router.put('/parcels/:parcelId/status',
  verifyToken,
  verifyAdmin,
  Parcels.changeStatus);

export default router;
