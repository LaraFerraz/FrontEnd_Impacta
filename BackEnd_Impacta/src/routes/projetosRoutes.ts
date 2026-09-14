import { Router } from 'express';
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

// Imagem de capa: dono da campanha (ou admin) envia via multipart/form-data.
router.post('/:id/imagem', autenticar, uploadImagemProjeto.single('imagem'), projetoController.uploadImagem);

// Galeria de fotos (além da capa): dono da campanha (ou admin) envia várias de uma vez.
router.post(
  '/:id/imagens',
  autenticar,
  uploadImagemProjeto.array('imagens', MAX_IMAGENS_GALERIA),
  projetoController.uploadImagens
);
router.delete('/:id/imagens/:imagemId', autenticar, projetoController.removeImagem);

export default router;
