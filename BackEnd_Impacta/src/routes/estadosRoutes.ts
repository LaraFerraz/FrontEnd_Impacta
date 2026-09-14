import { Router } from 'express';
import * as estadoController from '../controllers/estadoController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/todos', estadoController.listTodos);
router.get('/', estadoController.list);
router.get('/:id', estadoController.getById);
router.post('/', autenticar, estadoController.create);
router.put('/:id', autenticar, estadoController.update);
router.delete('/:id', autenticar, estadoController.remove);

export default router;
