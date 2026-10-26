import { Projeto, ImagemProjeto, Categoria, Usuario, Cidade, StatusCampanha, InfoCampanha, ServicosDisponiveis, StatusServico, Participacoes, StatusParticipacao, Avaliacoes } from '../models';
import { AuthorizationError, ErrorDetail, NotFoundError, ValidationError } from '../utils/errors';
import { findByIdOrFail, listPaginated, ListResult } from '../utils/crudHelpers';
import { STATUS_CAMPANHA_ATIVA } from '../utils/businessConstants';
import { caminhoPublico, removerArquivoAntigo } from '../middleware/uploadMiddleware';

const ADMIN_TIPO_ID = 1;

// Limite de fotos na galeria de uma campanha, além da imagem de capa.
export const MAX_IMAGENS_GALERIA = 6;

const INCLUDES_RESUMO = [
  { model: Categoria, as: 'categoria' as const, attributes: ['id', 'nome'] },
  { model: Usuario, as: 'criador' as const, attributes: ['id', 'nome'] },
  { model: Cidade, as: 'cidade' as const, attributes: ['id', 'nome'] },
  { model: StatusCampanha, as: 'status' as const, attributes: ['id', 'nome'] },
  {
    model: ImagemProjeto,
    as: 'imagens' as const,
    attributes: ['id', 'caminho', 'ordem'],
    separate: true,
    order: [['ordem', 'ASC']] as [string, string][]
  }
];

const INCLUDES_DETALHADOS = [
  { model: Categoria, as: 'categoria' as const, attributes: ['id', 'nome'] },
  { model: Usuario, as: 'criador' as const, attributes: ['id', 'nome', 'email', 'telefone'] },
  { model: Cidade, as: 'cidade' as const, attributes: ['id', 'nome'] },
  { model: StatusCampanha, as: 'status' as const, attributes: ['id', 'nome'] },
  { model: InfoCampanha, as: 'informacoes' as const },
  {
    model: ImagemProjeto,
    as: 'imagens' as const,
    attributes: ['id', 'caminho', 'ordem'],
    separate: true,
    order: [['ordem', 'ASC']] as [string, string][]
  },
  {
    model: ServicosDisponiveis,
    as: 'servicos' as const,
    include: [{ model: StatusServico, as: 'status' as const, attributes: ['id', 'nome'] }]
  },
  {
    model: Participacoes,
    as: 'participacoes' as const,
    attributes: ['id', 'usuario_id', 'data_inscricao'],
    include: [{ model: StatusParticipacao, as: 'status' as const, attributes: ['id', 'nome'] }],
    separate: true
  },
  {
    model: Avaliacoes,
    as: 'avaliacoes' as const,
    attributes: ['id', 'usuario_id', 'nota'],
    separate: true
  }
];

export interface ProjetoFiltros {
  categoria_id?: unknown;
  status_id?: unknown;
  criador_id?: unknown;
  cidade_id?: unknown;
  aprovado?: unknown;
  page?: unknown;
  limit?: unknown;
}

export interface ProjetoInput {
  titulo?: string;
  descricao?: string;
  categoria_id?: number;
  criador_id?: number;
  cidade_id?: number;
  data_inicio?: string;
  data_fim?: string;
  meta_participantes?: number;
  status_id?: number;
}

export interface UsuarioLogado {
  id: number;
  tipo: number;
}

/**
 * Regra de negócio da aprovação: campanhas não aprovadas só aparecem em
 * duas situações bem específicas:
 *  1) o próprio criador olhando a lista das SUAS campanhas (?criador_id=eu),
 *     pra acompanhar o status da submissão;
 *  2) um admin pedindo explicitamente a fila de moderação (?aprovado=false),
 *     que é a tela de "Aprovar Campanhas".
 *
 * Fora isso — inclusive um admin navegando a listagem pública normal, sem
 * nenhum desses filtros — só campanhas já aprovadas aparecem. Ser admin,
 * por si só, não deve "vazar" campanhas pendentes de outras pessoas pra
 * fora da tela de moderação.
 */
export const listProjetos = (
  filtros: ProjetoFiltros,
  usuarioLogado?: UsuarioLogado
): Promise<ListResult<Projeto>> => {
  const where: Record<string, unknown> = {};
  if (filtros.categoria_id) where.categoria_id = filtros.categoria_id;
  if (filtros.status_id) where.status_id = filtros.status_id;
  if (filtros.criador_id) where.criador_id = filtros.criador_id;
  if (filtros.cidade_id) where.cidade_id = filtros.cidade_id;

  const ehAdmin = usuarioLogado?.tipo === ADMIN_TIPO_ID;
  const vendoAsProprias = Boolean(usuarioLogado) && Number(filtros.criador_id) === usuarioLogado?.id;
  const filtroAprovadoExplicito = filtros.aprovado === 'true' || filtros.aprovado === 'false';

  if (ehAdmin && filtroAprovadoExplicito) {
    // Tela de moderação: admin pedindo pendentes ou aprovadas explicitamente.
    where.aprovado = filtros.aprovado === 'true';
    if (filtros.aprovado === 'false') {
      // "Pendente" é só quem ainda não foi decidido — reprovadas não voltam pra fila.
      where.reprovado = false;
    }
  } else if (vendoAsProprias) {
    // "Minhas campanhas criadas": o dono vê as próprias, aprovadas ou não,
    // a menos que ele mesmo peça um filtro explícito de status.
    if (filtroAprovadoExplicito) where.aprovado = filtros.aprovado === 'true';
  } else {
    // Listagem pública (para qualquer um, admin incluso, sem filtro explícito).
    where.aprovado = true;
  }

  return listPaginated(Projeto, {
    page: filtros.page,
    limit: filtros.limit,
    where,
    include: INCLUDES_RESUMO,
    order: [['data_criacao', 'DESC']]
  });
};

/**
 * Detalhe de uma campanha específica. Segue a mesma regra da listagem:
 * pendente só é visível para o próprio criador ou um admin — qualquer
 * outra pessoa (mesmo com o link direto) recebe 404, para não vazar
 * campanhas ainda não aprovadas via acesso direto por ID.
 */
export const getProjetoById = async (id: string, usuarioLogado?: UsuarioLogado): Promise<Projeto> => {
  const projeto = await findByIdOrFail(Projeto, id, INCLUDES_DETALHADOS, 'Projeto não encontrado');

  const ehAdmin = usuarioLogado?.tipo === ADMIN_TIPO_ID;
  const ehDono = Boolean(usuarioLogado) && projeto.criador_id === usuarioLogado?.id;

  if (!projeto.aprovado && !ehAdmin && !ehDono) {
    throw new NotFoundError('Projeto não encontrado');
  }

  return projeto;
};

export const createProjeto = async (input: ProjetoInput, usuarioAutenticadoId: number): Promise<Projeto> => {
  const errors: ErrorDetail[] = [];
  if (!input.titulo?.trim()) errors.push({ field: 'titulo', message: 'Título é obrigatório' });
  if (!input.descricao?.trim()) errors.push({ field: 'descricao', message: 'Descrição é obrigatória' });
  if (!input.categoria_id) errors.push({ field: 'categoria_id', message: 'Categoria é obrigatória' });
  if (!input.criador_id) errors.push({ field: 'criador_id', message: 'Criador é obrigatório' });
  if (!input.cidade_id) errors.push({ field: 'cidade_id', message: 'Cidade é obrigatória' });
  if (!input.status_id) errors.push({ field: 'status_id', message: 'Status é obrigatório' });

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  if (Number(input.criador_id) !== usuarioAutenticadoId) {
    throw new AuthorizationError('Você não tem permissão para criar um projeto para esta conta');
  }

  const projeto = await Projeto.create({
    titulo: input.titulo!.trim(),
    descricao: input.descricao!.trim(),
    categoria_id: input.categoria_id!,
    criador_id: input.criador_id!,
    cidade_id: input.cidade_id!,
    data_inicio: input.data_inicio ?? null,
    data_fim: input.data_fim ?? null,
    meta_participantes: input.meta_participantes ?? null,
    status_id: input.status_id!,
    // Toda campanha nasce pendente de aprovação, independente do que vier
    // no corpo da requisição — só um admin pode aprová-la depois.
    aprovado: false
  });

  return findByIdOrFail(Projeto, projeto.id, INCLUDES_RESUMO);
};

export interface UpdateProjetoResult {
  projeto: Projeto;
  statusMudou: boolean;
  statusAnterior?: number;
  statusNovo?: number;
  servicosSincronizados?: number;
}

export const updateProjeto = async (
  id: string,
  input: ProjetoInput,
  usuarioAutenticado: UsuarioLogado
): Promise<UpdateProjetoResult> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const ehAdmin = usuarioAutenticado.tipo === ADMIN_TIPO_ID;
  if (projeto.criador_id !== usuarioAutenticado.id && !ehAdmin) {
    throw new AuthorizationError('Você não tem permissão para editar este projeto');
  }

  const statusMudou = Boolean(input.status_id) && projeto.status_id !== input.status_id;
  const statusAnterior = projeto.status_id;

  // Se a campanha havia sido reprovada, editar o conteúdo é um pedido
  // implícito de nova revisão — volta pra fila de moderação em vez de
  // ficar "reprovada" pra sempre sem chance de reenvio.
  if (projeto.reprovado) {
    projeto.reprovado = false;
  }

  if (input.titulo) projeto.titulo = input.titulo.trim();
  if (input.descricao) projeto.descricao = input.descricao.trim();
  if (input.categoria_id) projeto.categoria_id = input.categoria_id;
  if (input.cidade_id) projeto.cidade_id = input.cidade_id;
  if (input.data_inicio) projeto.data_inicio = input.data_inicio;
  if (input.data_fim) projeto.data_fim = input.data_fim;
  if (input.meta_participantes) projeto.meta_participantes = input.meta_participantes;
  if (input.status_id) projeto.status_id = input.status_id;

  await projeto.save();

  let servicosSincronizados = 0;
  if (statusMudou) {
    const campanha_ativa = projeto.status_id === STATUS_CAMPANHA_ATIVA;
    const [updated] = await ServicosDisponiveis.update({ campanha_ativa }, { where: { projeto_id: id } });
    servicosSincronizados = updated;
  }

  const projetoAtualizado = await findByIdOrFail(Projeto, id, INCLUDES_RESUMO);

  return {
    projeto: projetoAtualizado,
    statusMudou,
    statusAnterior,
    statusNovo: input.status_id,
    servicosSincronizados
  };
};

export const deleteProjeto = async (id: string, usuarioAutenticado: UsuarioLogado): Promise<void> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const ehAdmin = usuarioAutenticado.tipo === ADMIN_TIPO_ID;
  if (projeto.criador_id !== usuarioAutenticado.id && !ehAdmin) {
    throw new AuthorizationError('Você não tem permissão para deletar este projeto');
  }

  removerArquivoAntigo(projeto.imagem);

  const imagensGaleria = await ImagemProjeto.findAll({ where: { projeto_id: id } });
  imagensGaleria.forEach((img) => removerArquivoAntigo(img.caminho));
  await ImagemProjeto.destroy({ where: { projeto_id: id } });

  await projeto.destroy();
};

/**
 * Aprovação/reprovação de campanha: ação exclusiva de admin (garantido
 * pelo middleware ehAdmin na rota).
 *
 * `aprovado=true`  → aprovada, aparece na listagem pública.
 * `aprovado=false` → reprovada, some da fila de moderação e passa a
 *                    contar como decidida (não é mais "pendente"). O
 *                    criador ainda consegue ver o status em "Minhas
 *                    Campanhas Criadas".
 *
 * Se o admin aprovar uma campanha que havia sido reprovada antes, o
 * campo `reprovado` é limpo — ela deixa de carregar esse rótulo.
 */
export const aprovarProjeto = async (id: string, aprovado: boolean): Promise<Projeto> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  projeto.aprovado = aprovado;
  projeto.reprovado = !aprovado;
  await projeto.save();

  return findByIdOrFail(Projeto, id, INCLUDES_RESUMO);
};

/**
 * Só o criador da campanha (ou um admin) pode trocar a imagem de capa.
 * Remove a imagem anterior do disco antes de salvar a nova, pra não
 * acumular arquivos órfãos.
 */
export const atualizarImagemProjeto = async (
  id: string,
  nomeArquivo: string,
  usuarioAutenticado: UsuarioLogado
): Promise<Projeto> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  const ehAdmin = usuarioAutenticado.tipo === ADMIN_TIPO_ID;
  if (projeto.criador_id !== usuarioAutenticado.id && !ehAdmin) {
    throw new AuthorizationError('Você não tem permissão para alterar a imagem deste projeto');
  }

  removerArquivoAntigo(projeto.imagem);
  projeto.imagem = caminhoPublico('projetos', nomeArquivo);
  await projeto.save();

  return findByIdOrFail(Projeto, id, INCLUDES_RESUMO);
};

const verificarPermissaoImagem = (projeto: Projeto, usuarioAutenticado: UsuarioLogado): void => {
  const ehAdmin = usuarioAutenticado.tipo === ADMIN_TIPO_ID;
  if (projeto.criador_id !== usuarioAutenticado.id && !ehAdmin) {
    throw new AuthorizationError('Você não tem permissão para alterar as fotos deste projeto');
  }
};

/**
 * Adiciona uma ou mais fotos à galeria da campanha (além da capa). Respeita
 * um limite máximo total (MAX_IMAGENS_GALERIA) somando o que já existe com
 * o que está sendo enviado agora, pra não deixar a página de detalhes
 * poluída nem o disco crescendo sem controle.
 */
export const adicionarImagensProjeto = async (
  id: string,
  arquivos: Express.Multer.File[],
  usuarioAutenticado: UsuarioLogado
): Promise<Projeto> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  verificarPermissaoImagem(projeto, usuarioAutenticado);

  if (!arquivos || arquivos.length === 0) {
    throw new ValidationError([{ field: 'imagens', message: 'Nenhum arquivo enviado' }]);
  }

  const totalExistente = await ImagemProjeto.count({ where: { projeto_id: id } });
  if (totalExistente + arquivos.length > MAX_IMAGENS_GALERIA) {
    throw new ValidationError([
      {
        field: 'imagens',
        message: `Limite de ${MAX_IMAGENS_GALERIA} fotos por campanha (já existem ${totalExistente}).`
      }
    ]);
  }

  await ImagemProjeto.bulkCreate(
    arquivos.map((arquivo, indice) => ({
      projeto_id: Number(id),
      caminho: caminhoPublico('projetos', arquivo.filename),
      ordem: totalExistente + indice
    }))
  );

  return findByIdOrFail(Projeto, id, INCLUDES_DETALHADOS);
};

/**
 * Remove uma foto específica da galeria (arquivo em disco + registro).
 */
export const removerImagemProjeto = async (
  id: string,
  imagemId: string,
  usuarioAutenticado: UsuarioLogado
): Promise<Projeto> => {
  const projeto = await Projeto.findByPk(id);
  if (!projeto) {
    throw new NotFoundError('Projeto não encontrado');
  }

  verificarPermissaoImagem(projeto, usuarioAutenticado);

  const imagem = await ImagemProjeto.findOne({ where: { id: imagemId, projeto_id: id } });
  if (!imagem) {
    throw new NotFoundError('Foto não encontrada nesta campanha');
  }

  removerArquivoAntigo(imagem.caminho);
  await imagem.destroy();

  return findByIdOrFail(Projeto, id, INCLUDES_DETALHADOS);
};
