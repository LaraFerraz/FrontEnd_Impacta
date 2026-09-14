import { Router } from 'express';
import * as participacaoController from '../controllers/participacaoController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.use(autenticar);

router.get('/', participacaoController.list);
router.get('/usuario/:usuario_id/campanhas', participacaoController.listPorUsuario);
router.get('/usuario/:usuario_id/projeto/:projeto_id/existe', participacaoController.verificarExistente);
router.get('/:id', participacaoController.getById);
router.post('/', participacaoController.create);
router.put('/:id', participacaoController.update);
router.delete('/:id', participacaoController.remove);

export default router;
