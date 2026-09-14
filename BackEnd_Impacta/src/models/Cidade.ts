import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Estado } from './Estado';

export class Cidade extends Model<InferAttributes<Cidade>, InferCreationAttributes<Cidade>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare estado_id: ForeignKey<Estado['id']>;
}

Cidade.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    estado_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: 'Cidade', timestamps: false }
);
