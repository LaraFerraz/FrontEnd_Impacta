import { Router, RequestHandler } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { autenticar, autorizarProprio, autorizarProprioOuAdmin, ehAdmin } from '../middleware/authMiddleware';
import { validarAtualizacao } from '../validators/userValidator';
import { uploadFotoPerfil } from '../middleware/uploadMiddleware';

const router = Router();

router.get('/', usuarioController.list);
router.get('/:id', usuarioController.getById);
router.get('/:id/profile', autenticar, autorizarProprio, usuarioController.getProfile);
router.put('/:id', autenticar, autorizarProprio, validarAtualizacao, usuarioController.update);
// O cast "as unknown as RequestHandler" contorna um conflito de tipos do
// monorepo: o npm workspaces hospeda uma cópia de @types/express@4 na raiz
// (puxada pelo webpack-dev-server do frontend) enquanto este backend usa
// @types/express@5 próprio. O multer.single()/.array() é tipado contra a
// versão da raiz, então o TypeScript vê dois "Request" incompatíveis neste
// ponto — sem impacto em runtime, é puramente um problema de resolução de
// tipos duplicados. Fix definitivo: `npm install` com os workspaces
// realinhados (fora do alcance deste ambiente sem rede).
router.post(
  '/:id/foto',
  autenticar,
  autorizarProprio,
  uploadFotoPerfil.single('foto') as unknown as RequestHandler,
  usuarioController.uploadFoto
);
// Dono da conta pode excluir a própria conta; admin pode excluir qualquer uma (moderação).
router.delete('/:id', autenticar, autorizarProprioOuAdmin, usuarioController.remove);
// Exclusiva de admin: promove/rebaixa o tipo de outro usuário (controle funcional de admin x usuário).
router.patch('/:id/tipo', autenticar, ehAdmin, usuarioController.updateTipo);

export default router;
