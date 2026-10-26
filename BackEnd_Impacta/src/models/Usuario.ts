import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Cidade } from './Cidade';
import { TipoUsuario } from './TipoUsuario';

export class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare senha: string;
  declare telefone: string | null;
  declare cidade_id: ForeignKey<Cidade['id']> | null;
  declare tipo_usuario_id: ForeignKey<TipoUsuario['id']>;
  declare cpf: string;
  declare foto: string | null;
  declare data_criacao: CreationOptional<Date>;

  /**
   * Garante que a senha (hash) nunca vaze em um res.json(usuario) por
   * esquecimento de `attributes` explícitos em alguma rota futura.
   */
  toJSON(): object {
    const values = { ...this.get() } as Record<string, unknown>;
    delete values.senha;
    return values;
  }
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'Nome é obrigatório' } }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { name: 'email', msg: 'Email já está em uso' },
      validate: {
        isEmail: { msg: 'Email deve ser válido' },
        notEmpty: { msg: 'Email é obrigatório' }
      }
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Senha é obrigatória' },
        len: { args: [6, 255], msg: 'Senha deve ter pelo menos 6 caracteres' }
      }
    },
    telefone: { type: DataTypes.STRING(20), allowNull: true },
    cidade_id: { type: DataTypes.INTEGER, allowNull: true },
    tipo_usuario_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: { name: 'cpf', msg: 'CPF já está em uso' },
      validate: { notEmpty: { msg: 'CPF é obrigatório' } }
    },
    foto: { type: DataTypes.STRING(255), allowNull: true },
    data_criacao: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'Usuario', timestamps: false }
);
