import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Pais extends Model<InferAttributes<Pais>, InferCreationAttributes<Pais>> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

Pais.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Nome do país é obrigatório' } }
    }
  },
  { sequelize, tableName: 'Pais', timestamps: false }
);
