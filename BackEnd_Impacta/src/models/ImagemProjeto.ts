import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Projeto } from './Projeto';

/**
 * Galeria de fotos de uma campanha. É separada do campo `imagem` do
 * Projeto (que continua sendo a foto de capa usada nos cards/listagem)
 * — aqui ficam as fotos extras exibidas na página de detalhes/descrição
 * da campanha.
 */
export class ImagemProjeto extends Model<InferAttributes<ImagemProjeto>, InferCreationAttributes<ImagemProjeto>> {
  declare id: CreationOptional<number>;
  declare projeto_id: ForeignKey<Projeto['id']>;
  declare caminho: string;
  declare ordem: CreationOptional<number>;
  declare data_criacao: CreationOptional<Date>;
}

ImagemProjeto.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false },
    caminho: { type: DataTypes.STRING(255), allowNull: false },
    ordem: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    data_criacao: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'ImagemProjeto', timestamps: false }
);
