import { Router } from 'express';
import Parcels from '../controllers/parcels';
import Users from '../controllers/users';
import verifyToken from '../middlewares/verifyToken';
import verifyAdmin from '../middlewares/verifyAdmin';

const router = Router();


router.get('/', (req, res) => {
  res.send('hello sendit');
});

router.get('/about', (req, res) => {
  res.send('hello sendit about now');
});

router.post('/parcels', verifyToken, Parcels.addParcels);

router.post('/auth/signup', Users.signup);

router.post('/auth/login', Users.login);

router.get('/parcels', verifyToken, verifyAdmin, Parcels.getAllOrders);

router.get('/parcels/:parcelId', Parcels.getOrder);

router.get('/users/:userId/parcels', Parcels.getUserOrders);

router.put('/parcels/:parcelId/cancel', verifyToken, Parcels.cancelOrder);


export default router;
