import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario } from './Usuario';
import { Projeto } from './Projeto';

export class Avaliacoes extends Model<InferAttributes<Avaliacoes>, InferCreationAttributes<Avaliacoes>> {
  declare id: CreationOptional<number>;
  declare usuario_id: ForeignKey<Usuario['id']>;
  declare projeto_id: ForeignKey<Projeto['id']>;
  declare nota: number;
  declare data_avaliacao: CreationOptional<Date>;
}

Avaliacoes.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Nota deve ser um número inteiro' },
        min: { args: [1], msg: 'Nota mínima é 1' },
        max: { args: [5], msg: 'Nota máxima é 5' }
      }
    },
    data_avaliacao: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'Avaliacoes',
    timestamps: false,
    indexes: [{ unique: true, fields: ['usuario_id', 'projeto_id'] }]
  }
);
