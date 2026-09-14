import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { autenticar, autorizarProprio, autorizarProprioOuAdmin } from '../middleware/authMiddleware';
import { validarAtualizacao } from '../validators/userValidator';
import { uploadFotoPerfil } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', usuarioController.list);
router.get('/:id', usuarioController.getById);
router.get('/:id/profile', autenticar, autorizarProprio, usuarioController.getProfile);
router.put('/:id', autenticar, autorizarProprio, validarAtualizacao, usuarioController.update);
router.post(
  '/:id/foto',
  autenticar,
  autorizarProprio,
  uploadFotoPerfil.single('foto'),
  usuarioController.uploadFoto
);
// Dono da conta pode excluir a própria conta; admin pode excluir qualquer uma (moderação).
router.delete('/:id', autenticar, autorizarProprioOuAdmin, usuarioController.remove);

export default router;
