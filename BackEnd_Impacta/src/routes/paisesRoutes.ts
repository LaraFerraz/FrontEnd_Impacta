import { Router } from 'express';
import * as paisController from '../controllers/paisController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/', paisController.list);
router.get('/:id', paisController.getById);
router.post('/', autenticar, paisController.create);
router.put('/:id', autenticar, paisController.update);
router.delete('/:id', autenticar, paisController.remove);

export default router;
