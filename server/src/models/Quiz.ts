import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';
import User from './User';
import { QuizAttributes } from '../interfaces/QuizAttributes.interface';

type QuizCreationAttributes = Optional<QuizAttributes, 'id' | 'description' | 'created_at'>;

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public id!: number;
  public user_id!: number;
  public title!: string;
  public description?: string;
  public created_at!: Date;
  public username?: string;
  public visibility?: string;
}

Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Quizzes',
    timestamps: false,
  }
);

export default Quiz;
