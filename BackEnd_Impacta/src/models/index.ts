import { sequelize } from '../config/database';
import { defineAssociations } from './associations';

export { Pais } from './Pais';
export { Estado } from './Estado';
export { Cidade } from './Cidade';
export { Categoria } from './Categoria';
export { TipoUsuario } from './TipoUsuario';
export { StatusCampanha } from './StatusCampanha';
export { StatusParticipacao } from './StatusParticipacao';
export { StatusServico } from './StatusServico';
export { Usuario } from './Usuario';
export { Projeto } from './Projeto';
export { ImagemProjeto } from './ImagemProjeto';
export { InfoCampanha } from './InfoCampanha';
export { ServicosDisponiveis } from './ServicosDisponiveis';
export { Participacoes } from './Participacoes';
export { Avaliacoes } from './Avaliacoes';
export { Favoritos } from './Favoritos';
export { Preferencias } from './Preferencias';

defineAssociations();

export { sequelize };
