import { Router } from 'express';
import * as avaliacaoController from '../controllers/avaliacaoController';

const router = Router();

router.get('/', avaliacaoController.list);
router.get('/:id', avaliacaoController.getById);
router.post('/', avaliacaoController.create);
router.put('/:id', avaliacaoController.update);
router.delete('/:id', avaliacaoController.remove);

export default router;
