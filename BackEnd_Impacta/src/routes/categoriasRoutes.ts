import { Router } from 'express';
import * as categoriaController from '../controllers/categoriaController';
import { autenticar, ehAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', categoriaController.list);
router.get('/:id', categoriaController.getById);
// Categorias são uma tabela de referência global: só admin gerencia.
router.post('/', autenticar, ehAdmin, categoriaController.create);
router.put('/:id', autenticar, ehAdmin, categoriaController.update);
router.delete('/:id', autenticar, ehAdmin, categoriaController.remove);

export default router;
