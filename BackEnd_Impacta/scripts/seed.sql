INSERT IGNORE INTO Tipo_usuario (id, nome) 
VALUES (1, 'Admin'), (2, 'Cliente'), (3, 'Funcionário');

INSERT IGNORE INTO Pais (id, nome) 
VALUES (1, 'Brasil');

INSERT IGNORE INTO Estado (id, nome, sigla, pais_id) 
VALUES 
  (1, 'São Paulo', 'SP', 1),
  (2, 'Rio de Janeiro', 'RJ', 1),
  (3, 'Minas Gerais', 'MG', 1),
  (4, 'Bahia', 'BA', 1),
  (5, 'Santa Catarina', 'SC', 1);

INSERT IGNORE INTO Cidade (id, nome, estado_id) 
VALUES 
  (1, 'São Paulo', 1),
  (2, 'Campinas', 1),
  (3, 'Rio de Janeiro', 2),
  (4, 'Belo Horizonte', 3),
  (5, 'Salvador', 4),
  (6, 'Florianópolis', 5);

INSERT IGNORE INTO Status_campanha (id, nome)
VALUES 
  (1, 'Rascunho'),
  (2, 'Ativa'),
  (3, 'Pausada'),
  (4, 'Encerrada');

INSERT IGNORE INTO Status_participacao (id, nome)
VALUES 
  (1, 'Aguardando Análise'),
  (2, 'Aprovado'),
  (3, 'Rejeitado'),
  (4, 'Cancelado');

INSERT IGNORE INTO Status_servico (id, nome)
VALUES 
  (1, 'Disponível'),
  (2, 'Indisponível'),
  (3, 'Descontinuado');

INSERT IGNORE INTO Categoria (id, nome)
VALUES 
  (1, 'Design'),
  (2, 'Desenvolvimento'),
  (3, 'Marketing'),
  (4, 'Consultoria'),
  (5, 'Análise de Dados');
