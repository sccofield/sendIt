import { Router } from 'express';

const router = Router();


router.get('/', (req, res) => {
  res.send('hello sendit')
})

router.get('/about', (req, res) => {
  res.send('hello sendit about now')
})

export default router;
