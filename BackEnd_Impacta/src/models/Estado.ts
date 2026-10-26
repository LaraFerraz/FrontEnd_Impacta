import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Pais } from './Pais';

export class Estado extends Model<InferAttributes<Estado>, InferCreationAttributes<Estado>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare sigla: string;
  declare pais_id: ForeignKey<Pais['id']>;
}

Estado.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    sigla: { type: DataTypes.STRING(2), allowNull: false },
    pais_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, tableName: 'Estado', timestamps: false }
);
