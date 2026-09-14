import { Pais } from './Pais';
import { Estado } from './Estado';
import { Cidade } from './Cidade';
import { Categoria } from './Categoria';
import { TipoUsuario } from './TipoUsuario';
import { StatusCampanha } from './StatusCampanha';
import { StatusParticipacao } from './StatusParticipacao';
import { StatusServico } from './StatusServico';
import { Usuario } from './Usuario';
import { Projeto } from './Projeto';
import { ImagemProjeto } from './ImagemProjeto';
import { InfoCampanha } from './InfoCampanha';
import { ServicosDisponiveis } from './ServicosDisponiveis';
import { Participacoes } from './Participacoes';
import { Avaliacoes } from './Avaliacoes';
import { Favoritos } from './Favoritos';
import { Preferencias } from './Preferencias';

export const defineAssociations = (): void => {
  // Geografia
  Pais.hasMany(Estado, { foreignKey: 'pais_id', as: 'estados' });
  Estado.belongsTo(Pais, { foreignKey: 'pais_id', as: 'pais' });

  Estado.hasMany(Cidade, { foreignKey: 'estado_id', as: 'cidades' });
  Cidade.belongsTo(Estado, { foreignKey: 'estado_id', as: 'estado' });

  Cidade.hasMany(Usuario, { foreignKey: 'cidade_id', as: 'usuarios' });
  Cidade.hasMany(Projeto, { foreignKey: 'cidade_id', as: 'projetos' });

  // Categoria
  Categoria.hasMany(Projeto, { foreignKey: 'categoria_id', as: 'projetos' });
  Categoria.hasMany(Preferencias, { foreignKey: 'categoria_id', as: 'preferencias' });

  // Usuário
  TipoUsuario.hasMany(Usuario, { foreignKey: 'tipo_usuario_id', as: 'usuarios' });
  Usuario.belongsTo(Cidade, { foreignKey: 'cidade_id', as: 'cidade' });
  Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario_id', as: 'tipo' });
  Usuario.hasMany(Projeto, { foreignKey: 'criador_id', as: 'projetos_criados' });
  Usuario.hasMany(Preferencias, { foreignKey: 'usuario_id', as: 'preferencias' });
  Usuario.hasMany(Participacoes, { foreignKey: 'usuario_id', as: 'participacoes' });
  Usuario.hasMany(Avaliacoes, { foreignKey: 'usuario_id', as: 'avaliacoes' });
  Usuario.hasMany(Favoritos, { foreignKey: 'usuario_id', as: 'favoritos' });

  // Projeto
  Projeto.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
  Projeto.belongsTo(Usuario, { foreignKey: 'criador_id', as: 'criador' });
  Projeto.belongsTo(Cidade, { foreignKey: 'cidade_id', as: 'cidade' });
  Projeto.belongsTo(StatusCampanha, { foreignKey: 'status_id', as: 'status' });
  Projeto.hasOne(InfoCampanha, { foreignKey: 'projeto_id', as: 'informacoes' });
  Projeto.hasMany(ImagemProjeto, { foreignKey: 'projeto_id', as: 'imagens' });
  ImagemProjeto.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
  Projeto.hasMany(ServicosDisponiveis, { foreignKey: 'projeto_id', as: 'servicos' });
  Projeto.hasMany(Participacoes, { foreignKey: 'projeto_id', as: 'participacoes' });
  Projeto.hasMany(Avaliacoes, { foreignKey: 'projeto_id', as: 'avaliacoes' });
  Projeto.hasMany(Favoritos, { foreignKey: 'projeto_id', as: 'favoritados_por' });
  StatusCampanha.hasMany(Projeto, { foreignKey: 'status_id', as: 'projetos' });

  // Info da campanha
  InfoCampanha.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });

  // Serviços disponíveis
  ServicosDisponiveis.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
  ServicosDisponiveis.belongsTo(StatusServico, { foreignKey: 'status_servico_id', as: 'status' });
  ServicosDisponiveis.hasMany(Participacoes, { foreignKey: 'servico_id', as: 'participacoes' });
  StatusServico.hasMany(ServicosDisponiveis, { foreignKey: 'status_servico_id', as: 'servicos' });

  // Participações
  Participacoes.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Participacoes.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });
  Participacoes.belongsTo(ServicosDisponiveis, { foreignKey: 'servico_id', as: 'servico' });
  Participacoes.belongsTo(StatusParticipacao, { foreignKey: 'status_participacao_id', as: 'status' });
  StatusParticipacao.hasMany(Participacoes, { foreignKey: 'status_participacao_id', as: 'participacoes' });

  // Avaliações
  Avaliacoes.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Avaliacoes.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });

  // Favoritos
  Favoritos.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Favoritos.belongsTo(Projeto, { foreignKey: 'projeto_id', as: 'projeto' });

  // Preferências
  Preferencias.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  Preferencias.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
};
