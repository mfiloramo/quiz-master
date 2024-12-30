import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "../config/sequelize";
import Session from './Session';
import User from './User';
import Question from './Question';

interface PlayerAnswerAttributes {
  id: number;
  session_id: number;
  player_id: number;
  question_id: number;
  answer: number;
  is_correct: boolean;
  score: number;
}

type PlayerAnswerCreationAttributes = Optional<PlayerAnswerAttributes, 'id' | 'score'>;

class PlayerAnswer extends Model<PlayerAnswerAttributes, PlayerAnswerCreationAttributes> implements PlayerAnswerAttributes {
  public id!: number;
  public session_id!: number;
  public player_id!: number;
  public question_id!: number;
  public answer!: number;
  public is_correct!: boolean;
  public score!: number;
}

PlayerAnswer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Session,
      key: 'id',
    },
  },
  player_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question,
      key: 'id',
    },
  },
  answer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize,
  tableName: 'Player_Answers',
  timestamps: false,
});

export default PlayerAnswer;
