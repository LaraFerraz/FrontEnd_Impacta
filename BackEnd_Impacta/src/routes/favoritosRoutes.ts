import { Router } from 'express';
import * as favoritoController from '../controllers/favoritoController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.use(autenticar);

router.get('/usuario/:usuario_id', favoritoController.listPorUsuario);
router.get('/:id', favoritoController.getById);
router.post('/', favoritoController.create);
router.delete('/usuario/:usuario_id/projeto/:projeto_id', favoritoController.removePorParConta);
router.delete('/:id', favoritoController.remove);

export default router;
