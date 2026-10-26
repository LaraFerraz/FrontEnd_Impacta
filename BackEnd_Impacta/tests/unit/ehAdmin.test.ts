import { Request, Response } from 'express';
import { ehAdmin, autorizarProprioOuAdmin } from '../../src/middleware/authMiddleware';

const criarMockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ehAdmin', () => {
  it('deixa passar quando req.usuario.tipo === 1 (Admin)', () => {
    const req = { usuario: { id: 1, tipo: 1 } } as unknown as Request;
    const res = criarMockRes();
    const next = jest.fn();

    ehAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('bloqueia com 403 quando req.usuario.tipo !== 1 (Cliente)', () => {
    const req = { usuario: { id: 2, tipo: 2 } } as unknown as Request;
    const res = criarMockRes();
    const next = jest.fn();

    ehAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'AUTHORIZATION_ERROR' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('bloqueia com 403 quando não há req.usuario (não autenticado)', () => {
    const req = {} as Request;
    const res = criarMockRes();
    const next = jest.fn();

    ehAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('autorizarProprioOuAdmin', () => {
  it('admin pode agir sobre qualquer usuário (IDs diferentes)', () => {
    const req = { usuario: { id: 99, tipo: 1 }, params: { id: '2' } } as unknown as Request;
    const res = criarMockRes();
    const next = jest.fn();

    autorizarProprioOuAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('cliente só pode agir sobre o próprio ID', () => {
    const req = { usuario: { id: 2, tipo: 2 }, params: { id: '2' } } as unknown as Request;
    const res = criarMockRes();
    const next = jest.fn();

    autorizarProprioOuAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('cliente tentando agir sobre outro ID recebe 403', () => {
    const req = { usuario: { id: 2, tipo: 2 }, params: { id: '5' } } as unknown as Request;
    const res = criarMockRes();
    const next = jest.fn();

    autorizarProprioOuAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
