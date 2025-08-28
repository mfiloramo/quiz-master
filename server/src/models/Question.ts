import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/sequelize';
import Quiz from './Quiz';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';

type QuestionCreationAttributes = Optional<QuestionAttributes, 'id'>;

class Question
  extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes
{
  public id!: number;
  public quiz_id!: number;
  public question!: string;
  public options!: string;
  public correct!: string;
}

Question.init(
  {
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    correct: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Questions',
    timestamps: false,
  }
);

export default Question;
