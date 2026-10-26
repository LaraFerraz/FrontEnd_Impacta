import { Includeable, Model, ModelStatic, Order, WhereOptions } from 'sequelize';
import { NotFoundError } from './errors';
import { buildPaginationMeta, extractPagination, PaginationMeta } from './pagination';

export interface ListOptions {
  page?: unknown;
  limit?: unknown;
  where?: WhereOptions;
  include?: Includeable[];
  order?: Order;
  defaultLimit?: number;
}

export interface ListResult<M> {
  rows: M[];
  pagination: PaginationMeta;
}

/**
 * Busca paginada genérica, reutilizada por todos os services de listagem.
 * Centraliza a lógica de paginação sanitizada (ver utils/pagination.ts).
 */
export const listPaginated = async <M extends Model>(
  model: ModelStatic<M>,
  options: ListOptions = {}
): Promise<ListResult<M>> => {
  const pagination = extractPagination(options.page, options.limit, options.defaultLimit);

  const { count, rows } = await model.findAndCountAll({
    where: options.where,
    include: options.include,
    order: options.order,
    limit: pagination.limit,
    offset: pagination.offset
  });

  return { rows, pagination: buildPaginationMeta(count, pagination) };
};

/**
 * Busca por PK ou lança NotFoundError, evitando repetir o mesmo
 * if (!registro) { return res.status(404)... } em cada rota.
 */
export const findByIdOrFail = async <M extends Model>(
  model: ModelStatic<M>,
  id: string | number,
  include?: Includeable[],
  notFoundMessage = 'Recurso não encontrado'
): Promise<M> => {
  const record = await model.findByPk(id, { include });
  if (!record) {
    throw new NotFoundError(notFoundMessage);
  }
  return record;
};
