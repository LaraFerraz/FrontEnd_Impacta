import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class StatusServico extends Model<InferAttributes<StatusServico>, InferCreationAttributes<StatusServico>> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

StatusServico.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },
  { sequelize, tableName: 'Status_servico', timestamps: false }
);
