import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Projeto } from './Projeto';

export class InfoCampanha extends Model<InferAttributes<InfoCampanha>, InferCreationAttributes<InfoCampanha>> {
  declare id: CreationOptional<number>;
  declare projeto_id: ForeignKey<Projeto['id']>;
  declare objetivos: string | null;
  declare publico_alvo: string | null;
  declare impacto_esperado: string | null;
  declare regras: string | null;
  declare observacoes: string | null;
}

InfoCampanha.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false },
    objetivos: { type: DataTypes.TEXT, allowNull: true },
    publico_alvo: { type: DataTypes.TEXT, allowNull: true },
    impacto_esperado: { type: DataTypes.TEXT, allowNull: true },
    regras: { type: DataTypes.TEXT, allowNull: true },
    observacoes: { type: DataTypes.TEXT, allowNull: true }
  },
  { sequelize, tableName: 'Info_campanha', timestamps: false }
);
