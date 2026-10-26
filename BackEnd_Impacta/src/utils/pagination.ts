export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  total: number;
  pagina_atual: number;
  limite: number;
  total_paginas: number;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Extrai e sanitiza os parâmetros de paginação vindos da query string.
 * O limite é sempre travado em MAX_LIMIT, evitando que alguém peça
 * `?limit=999999` e force uma consulta pesada no banco.
 */
export const extractPagination = (
  pageQuery: unknown,
  limitQuery: unknown,
  defaultLimit: number = DEFAULT_LIMIT
): PaginationParams => {
  const page = Math.max(1, parseInt(String(pageQuery ?? '1'), 10) || 1);
  const requestedLimit = parseInt(String(limitQuery ?? defaultLimit), 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requestedLimit), MAX_LIMIT);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const buildPaginationMeta = (total: number, pagination: PaginationParams): PaginationMeta => ({
  total,
  pagina_atual: pagination.page,
  limite: pagination.limit,
  total_paginas: Math.ceil(total / pagination.limit) || 0
});
