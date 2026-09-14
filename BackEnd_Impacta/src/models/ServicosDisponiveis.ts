import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Projeto } from './Projeto';
import { StatusServico } from './StatusServico';

export class ServicosDisponiveis extends Model<
  InferAttributes<ServicosDisponiveis>,
  InferCreationAttributes<ServicosDisponiveis>
> {
  declare id: CreationOptional<number>;
  declare projeto_id: ForeignKey<Projeto['id']>;
  declare nome_servico: string;
  declare descricao: string | null;
  declare quantidade_necessaria: number | null;
  declare status_servico_id: ForeignKey<StatusServico['id']>;
  declare campanha_ativa: CreationOptional<boolean>;
}

ServicosDisponiveis.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    projeto_id: { type: DataTypes.INTEGER, allowNull: false },
    nome_servico: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'Nome do serviço é obrigatório' } }
    },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    quantidade_necessaria: { type: DataTypes.INTEGER, allowNull: true },
    status_servico_id: { type: DataTypes.INTEGER, allowNull: false },
    campanha_ativa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica se a campanha do projeto ainda está ativa'
    }
  },
  { sequelize, tableName: 'Servicos_disponiveis', timestamps: false }
);
