import { NextFunction, Request, Response } from 'express';
import * as projetoService from '../services/projetoService';
import { STATUS_CAMPANHA_ATIVA } from '../utils/businessConstants';
import { ValidationError } from '../utils/errors';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarioLogado = req.usuario ? { id: req.usuario.id, tipo: req.usuario.tipo } : undefined;
    const { rows, pagination } = await projetoService.listProjetos(req.query, usuarioLogado);
    res.json({ data: rows, pagination });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const usuarioLogado = req.usuario ? { id: req.usuario.id, tipo: req.usuario.tipo } : undefined;
    const projeto = await projetoService.getProjetoById(String(req.params.id), usuarioLogado);
    res.json({ data: projeto });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projeto = await projetoService.createProjeto(req.body, req.usuario!.id);
    res.status(201).json({ message: 'Projeto criado com sucesso', data: projeto });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await projetoService.updateProjeto(String(req.params.id), req.body, {
      id: req.usuario!.id,
      tipo: req.usuario!.tipo
    });

    const response: Record<string, unknown> = {
      message: 'Projeto atualizado com sucesso',
      data: resultado.projeto
    };

    if (resultado.statusMudou) {
      response.info = {
        status_alterado: true,
        status_anterior: resultado.statusAnterior,
        status_novo: resultado.statusNovo,
        servicos_sincronizados: resultado.servicosSincronizados,
        campanha_ativa_agora: resultado.statusNovo === STATUS_CAMPANHA_ATIVA
      };
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await projetoService.deleteProjeto(String(req.params.id), { id: req.usuario!.id, tipo: req.usuario!.tipo });
    res.json({ message: 'Projeto deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projetos/:id/aprovar — exclusivo de admin (ver rota).
 * Corpo esperado: { "aprovado": true } ou { "aprovado": false }.
 */
export const aprovar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (typeof req.body?.aprovado !== 'boolean') {
      throw new ValidationError([{ field: 'aprovado', message: 'Informe aprovado: true ou false' }]);
    }

    const projeto = await projetoService.aprovarProjeto(String(req.params.id), req.body.aprovado);
    res.json({
      message: req.body.aprovado ? 'Campanha aprovada com sucesso' : 'Campanha reprovada',
      data: projeto
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projetos/:id/imagem — multipart/form-data, campo "imagem".
 */
export const uploadImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new ValidationError([{ field: 'imagem', message: 'Nenhum arquivo enviado' }]);
    }

    const projeto = await projetoService.atualizarImagemProjeto(String(req.params.id), req.file.filename, {
      id: req.usuario!.id,
      tipo: req.usuario!.tipo
    });

    res.json({ message: 'Imagem atualizada com sucesso', data: projeto });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projetos/:id/imagens — multipart/form-data, campo "imagens" (múltiplo).
 * Adiciona fotos à galeria da campanha (exibida na página de detalhes).
 */
export const uploadImagens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const arquivos = (req.files as Express.Multer.File[]) || [];
    if (arquivos.length === 0) {
      throw new ValidationError([{ field: 'imagens', message: 'Nenhum arquivo enviado' }]);
    }

    const projeto = await projetoService.adicionarImagensProjeto(String(req.params.id), arquivos, {
      id: req.usuario!.id,
      tipo: req.usuario!.tipo
    });

    res.status(201).json({ message: 'Fotos adicionadas com sucesso', data: projeto });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projetos/:id/imagens/:imagemId — remove uma foto da galeria.
 */
export const removeImagem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projeto = await projetoService.removerImagemProjeto(String(req.params.id), String(req.params.imagemId), {
      id: req.usuario!.id,
      tipo: req.usuario!.tipo
    });

    res.json({ message: 'Foto removida com sucesso', data: projeto });
  } catch (error) {
    next(error);
  }
};
