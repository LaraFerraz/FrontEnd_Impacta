import { Router, RequestHandler } from 'express';
import * as projetoController from '../controllers/projetoController';
import { autenticar, autenticarOpcional, ehAdmin } from '../middleware/authMiddleware';
import { uploadImagemProjeto } from '../middleware/uploadMiddleware';
import { MAX_IMAGENS_GALERIA } from '../services/projetoService';

const router = Router();

router.get('/', autenticarOpcional, projetoController.list);
router.get('/:id', autenticarOpcional, projetoController.getById);
router.post('/', autenticar, projetoController.create);
router.put('/:id', autenticar, projetoController.update);
router.delete('/:id', autenticar, projetoController.remove);

// Moderação: só admin aprova/reprova uma campanha.
router.patch('/:id/aprovar', autenticar, ehAdmin, projetoController.aprovar);

// Os casts "as unknown as RequestHandler" contornam um conflito de tipos do
// monorepo (@types/express duplicado entre raiz e backend — ver mesmo
// comentário em userRoutes.ts). Sem efeito em runtime.

// Imagem de capa: dono da campanha (ou admin) envia via multipart/form-data.
router.post(
  '/:id/imagem',
  autenticar,
  uploadImagemProjeto.single('imagem') as unknown as RequestHandler,
  projetoController.uploadImagem
);

// Galeria de fotos (além da capa): dono da campanha (ou admin) envia várias de uma vez.
router.post(
  '/:id/imagens',
  autenticar,
  uploadImagemProjeto.array('imagens', MAX_IMAGENS_GALERIA) as unknown as RequestHandler,
  projetoController.uploadImagens
);
router.delete('/:id/imagens/:imagemId', autenticar, projetoController.removeImagem);

export default router;
