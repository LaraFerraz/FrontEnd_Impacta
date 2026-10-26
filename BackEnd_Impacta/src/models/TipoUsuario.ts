import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class TipoUsuario extends Model<InferAttributes<TipoUsuario>, InferCreationAttributes<TipoUsuario>> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

TipoUsuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },
  { sequelize, tableName: 'Tipo_usuario', timestamps: false }
);
