import { AuthorizationError, BusinessRuleError, NotFoundError, ValidationError } from '../../src/utils/errors';

jest.mock('../../src/models', () => ({
  Participacoes: { create: jest.fn(), findByPk: jest.fn() },
  Usuario: {},
  Projeto: { findByPk: jest.fn() },
  ServicosDisponiveis: {},
  StatusParticipacao: {},
  Categoria: {},
  StatusCampanha: {}
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Projeto, Participacoes } = require('../../src/models');
import { createParticipacao } from '../../src/services/participacaoService';

describe('participacaoService.createParticipacao (RF07)', () => {
  const usuarioAutenticadoId = 42;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lança ValidationError se usuario_id ou projeto_id não forem enviados', async () => {
    await expect(createParticipacao({}, usuarioAutenticadoId)).rejects.toBeInstanceOf(ValidationError);
  });

  it('lança AuthorizationError se o usuário tentar se inscrever em nome de outra conta', async () => {
    await expect(
      createParticipacao({ usuario_id: 999, projeto_id: 1 }, usuarioAutenticadoId)
    ).rejects.toBeInstanceOf(AuthorizationError);
  });

  it('lança NotFoundError se a campanha não existir', async () => {
    Projeto.findByPk.mockResolvedValue(null);

    await expect(
      createParticipacao({ usuario_id: usuarioAutenticadoId, projeto_id: 999 }, usuarioAutenticadoId)
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('lança BusinessRuleError se a campanha estiver em Planejamento (status_id 1, ainda não ativa)', async () => {
    Projeto.findByPk.mockResolvedValue({ id: 1, status_id: 1 });

    await expect(
      createParticipacao({ usuario_id: usuarioAutenticadoId, projeto_id: 1 }, usuarioAutenticadoId)
    ).rejects.toBeInstanceOf(BusinessRuleError);
  });

  it('lança BusinessRuleError se a campanha estiver Concluída ou Cancelada', async () => {
    Projeto.findByPk.mockResolvedValue({ id: 1, status_id: 4 });

    await expect(
      createParticipacao({ usuario_id: usuarioAutenticadoId, projeto_id: 1 }, usuarioAutenticadoId)
    ).rejects.toBeInstanceOf(BusinessRuleError);
  });

  it('cria a participação normalmente quando a campanha está Em Andamento (status_id 2)', async () => {
    Projeto.findByPk.mockResolvedValue({ id: 1, status_id: 2 });
    Participacoes.create.mockResolvedValue({ id: 10 });
    Participacoes.findByPk.mockResolvedValue({ id: 10, usuario_id: usuarioAutenticadoId, projeto_id: 1 });

    const resultado = await createParticipacao({ usuario_id: usuarioAutenticadoId, projeto_id: 1 }, usuarioAutenticadoId);

    expect(Participacoes.create).toHaveBeenCalledWith(
      expect.objectContaining({ usuario_id: usuarioAutenticadoId, projeto_id: 1, status_participacao_id: 1 })
    );
    expect(resultado).toEqual({ id: 10, usuario_id: usuarioAutenticadoId, projeto_id: 1 });
  });
});
