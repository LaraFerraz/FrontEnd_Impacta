import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario } from './Usuario';
import { Projeto } from './Projeto';

export class Favoritos extends Model<InferAttributes<Favoritos>, InferCreationAttributes<Favoritos>> {
  declare id: CreationOptional<number>;
  declare usuario_id: ForeignKey<Usuario['id']>;
  declare projeto_id: ForeignKey<Projeto['id']>;
}

Favoritos.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    tableName: 'Favoritos',
    timestamps: false,
    indexes: [{ unique: true, fields: ['usuario_id', 'projeto_id'] }]
  }
);
