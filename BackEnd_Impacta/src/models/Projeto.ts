import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Categoria } from './Categoria';
import { Usuario } from './Usuario';
import { Cidade } from './Cidade';
import { StatusCampanha } from './StatusCampanha';

export class Projeto extends Model<InferAttributes<Projeto>, InferCreationAttributes<Projeto>> {
  declare id: CreationOptional<number>;
  declare titulo: string;
  declare descricao: string;
  declare categoria_id: ForeignKey<Categoria['id']>;
  declare criador_id: ForeignKey<Usuario['id']>;
  declare cidade_id: ForeignKey<Cidade['id']>;
  declare data_inicio: string | null;
  declare data_fim: string | null;
  declare meta_participantes: number | null;
  declare status_id: ForeignKey<StatusCampanha['id']>;
  declare imagem: string | null;
  declare aprovado: CreationOptional<boolean>;
  declare reprovado: CreationOptional<boolean>;
  declare data_criacao: CreationOptional<Date>;
}

Projeto.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'Título é obrigatório' } }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: 'Descrição é obrigatória' } }
    },
    categoria_id: { type: DataTypes.INTEGER, allowNull: false },
    criador_id: { type: DataTypes.INTEGER, allowNull: false },
    cidade_id: { type: DataTypes.INTEGER, allowNull: false },
    data_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    data_fim: { type: DataTypes.DATEONLY, allowNull: true },
    meta_participantes: { type: DataTypes.INTEGER, allowNull: true },
    status_id: { type: DataTypes.INTEGER, allowNull: false },
    imagem: { type: DataTypes.STRING(255), allowNull: true },
    // false = ainda não decidido (pendente) OU rejeitado — a diferença
    // entre essas duas situações fica no campo `reprovado` abaixo.
    aprovado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    reprovado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    data_criacao: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'Projeto', timestamps: false }
);
