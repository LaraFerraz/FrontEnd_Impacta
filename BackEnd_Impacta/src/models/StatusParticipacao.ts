import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class StatusParticipacao extends Model<
  InferAttributes<StatusParticipacao>,
  InferCreationAttributes<StatusParticipacao>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
}

StatusParticipacao.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(50), allowNull: false, unique: true }
  },
  { sequelize, tableName: 'Status_participacao', timestamps: false }
);
