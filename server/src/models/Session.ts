import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "../config/sequelize";
import Quiz from './Quiz';
import User from './User';
import { SessionAttributes } from "../interfaces/SessionAttributes.interface";

type SessionCreationAttributes = Optional<SessionAttributes, 'id' | 'created_at'>;


class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: number;
  public quiz_id!: number;
  public host_user_id!: number;
  public status!: string;
  public created_at!: Date;
}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id',
    },
  },
  host_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'created',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'Sessions',
  timestamps: false,
});

export default Session;
