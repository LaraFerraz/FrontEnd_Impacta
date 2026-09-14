import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario } from './Usuario';
import { Projeto } from './Projeto';
import { ServicosDisponiveis } from './ServicosDisponiveis';
import { StatusParticipacao } from './StatusParticipacao';

export class Participacoes extends Model<InferAttributes<Participacoes>, InferCreationAttributes<Participacoes>> {
  declare id: CreationOptional<number>;
  declare usuario_id: ForeignKey<Usuario['id']>;
  declare projeto_id: ForeignKey<Projeto['id']>;
  declare servico_id: ForeignKey<ServicosDisponiveis['id']> | null;
  declare data_inscricao: CreationOptional<Date>;
  declare status_participacao_id: ForeignKey<StatusParticipacao['id']>;
}

Participacoes.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false },
    servico_id: { type: DataTypes.INTEGER, allowNull: true },
    data_inscricao: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    status_participacao_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: 'Participacoes', timestamps: false }
);
