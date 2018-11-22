import { Router } from 'express';
import Parcels from '../controllers/parcels';
import Users from '../controllers/users';
import verifyToken from '../middlewares/verifyToken';

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


export default router;
