import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario } from './Usuario';
import { Categoria } from './Categoria';

export class Preferencias extends Model<InferAttributes<Preferencias>, InferCreationAttributes<Preferencias>> {
  declare id: CreationOptional<number>;
  declare usuario_id: ForeignKey<Usuario['id']>;
  declare categoria_id: ForeignKey<Categoria['id']>;
}

Preferencias.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    categoria_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    tableName: 'Preferencias',
    timestamps: false,
    indexes: [{ unique: true, fields: ['usuario_id', 'categoria_id'] }]
  }
);
