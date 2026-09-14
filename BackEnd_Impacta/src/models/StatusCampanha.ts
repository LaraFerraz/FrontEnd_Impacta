import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class StatusCampanha extends Model<InferAttributes<StatusCampanha>, InferCreationAttributes<StatusCampanha>> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

StatusCampanha.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },
  { sequelize, tableName: 'Status_campanha', timestamps: false }
);
