import { NotFoundError, ValidationError } from '../../src/utils/errors';

jest.mock('../../src/models', () => ({
  Usuario: { findByPk: jest.fn() },
  Cidade: {},
  TipoUsuario: { findByPk: jest.fn() }
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Usuario, TipoUsuario } = require('../../src/models');
import { updateTipoUsuario } from '../../src/services/usuarioService';

describe('usuarioService.updateTipoUsuario (Tech Forge: controle funcional admin x usuário)', () => {
  const ADMIN_LOGADO_ID = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lança ValidationError se tipo_usuario_id não for enviado', async () => {
    await expect(updateTipoUsuario('2', undefined, ADMIN_LOGADO_ID)).rejects.toBeInstanceOf(ValidationError);
  });

  it('lança ValidationError se tipo_usuario_id não for numérico', async () => {
    await expect(updateTipoUsuario('2', 'abc', ADMIN_LOGADO_ID)).rejects.toBeInstanceOf(ValidationError);
  });

  it('lança ValidationError se o tipo de usuário informado não existir', async () => {
    TipoUsuario.findByPk.mockResolvedValue(null);

    await expect(updateTipoUsuario('2', 99, ADMIN_LOGADO_ID)).rejects.toBeInstanceOf(ValidationError);
  });

  it('lança NotFoundError se o usuário alvo não existir', async () => {
    TipoUsuario.findByPk.mockResolvedValue({ id: 1, nome: 'Admin' });
    Usuario.findByPk.mockResolvedValue(null);

    await expect(updateTipoUsuario('999', 1, ADMIN_LOGADO_ID)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('impede que o admin logado remova o próprio privilégio de admin', async () => {
    TipoUsuario.findByPk.mockResolvedValue({ id: 2, nome: 'Cliente' });
    Usuario.findByPk.mockResolvedValue({ id: ADMIN_LOGADO_ID, tipo_usuario_id: 1, save: jest.fn() });

    await expect(
      updateTipoUsuario(String(ADMIN_LOGADO_ID), 2, ADMIN_LOGADO_ID)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('promove um cliente a admin com sucesso', async () => {
    const usuarioMock = { id: 2, tipo_usuario_id: 2, save: jest.fn().mockResolvedValue(undefined) };
    TipoUsuario.findByPk.mockResolvedValue({ id: 1, nome: 'Admin' });
    Usuario.findByPk
      .mockResolvedValueOnce(usuarioMock) // findByPk dentro de updateTipoUsuario
      .mockResolvedValueOnce({ id: 2, tipo_usuario_id: 1 }); // findByPk dentro de getUsuarioPerfilCompleto

    const resultado = await updateTipoUsuario('2', 1, ADMIN_LOGADO_ID);

    expect(usuarioMock.tipo_usuario_id).toBe(1);
    expect(usuarioMock.save).toHaveBeenCalled();
    expect(resultado).toEqual({ id: 2, tipo_usuario_id: 1 });
  });
});
