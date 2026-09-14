import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ValidationError } from '../utils/errors';

/**
 * Upload de imagens (fotos de perfil e imagens de campanha) via Multer.
 *
 * Regras de negócio aplicadas aqui (Tech Forge):
 *  - Extensão E mimetype precisam ser de imagem (jpg/jpeg/png/webp).
 *  - Tamanho máximo de 5MB por arquivo.
 *  - Nome do arquivo sempre gerado (timestamp + hash aleatório), nunca o
 *    nome original do usuário — elimina colisão de nomes mesmo em uploads
 *    simultâneos com o mesmo nome de arquivo original.
 */

const EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];
const MIME_TYPES_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
export const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024; // 5MB

const PASTA_UPLOADS_RAIZ = path.join(__dirname, '..', '..', 'uploads');

const criarStorage = (subpasta: string): multer.StorageEngine => {
  const destino = path.join(PASTA_UPLOADS_RAIZ, subpasta);
  fs.mkdirSync(destino, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destino),
    filename: (_req, file, cb) => {
      const extensao = path.extname(file.originalname).toLowerCase();
      const nomeUnico = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extensao}`;
      cb(null, nomeUnico);
    }
  });
};

const filtroDeImagem = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const extensao = path.extname(file.originalname).toLowerCase();
  const extensaoValida = EXTENSOES_PERMITIDAS.includes(extensao);
  const mimeValido = MIME_TYPES_PERMITIDOS.includes(file.mimetype);

  if (!extensaoValida || !mimeValido) {
    cb(
      new ValidationError([
        {
          field: 'imagem',
          message: 'Formato inválido. Envie um arquivo .jpg, .jpeg, .png ou .webp'
        }
      ])
    );
    return;
  }

  cb(null, true);
};

const criarUploader = (subpasta: string): multer.Multer =>
  multer({
    storage: criarStorage(subpasta),
    fileFilter: filtroDeImagem,
    limits: { fileSize: TAMANHO_MAXIMO_BYTES }
  });

export const uploadImagemProjeto = criarUploader('projetos');
export const uploadFotoPerfil = criarUploader('perfis');

/**
 * Caminho público (servido por express.static) de um arquivo salvo em /uploads.
 */
export const caminhoPublico = (subpasta: string, nomeArquivo: string): string =>
  `/uploads/${subpasta}/${nomeArquivo}`;

/**
 * Remove um arquivo antigo do disco (ex: ao trocar a foto de perfil ou a
 * imagem do projeto). Falha silenciosamente se o arquivo já não existir,
 * já que isso não deve impedir a requisição de completar.
 */
export const removerArquivoAntigo = (caminhoPublicoAntigo: string | null | undefined): void => {
  if (!caminhoPublicoAntigo) return;
  const caminhoAbsoluto = path.join(PASTA_UPLOADS_RAIZ, '..', caminhoPublicoAntigo);
  fs.unlink(caminhoAbsoluto, () => undefined);
};
