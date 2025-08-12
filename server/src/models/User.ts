import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "../config/sequelize";
import { UserAttributes } from "../interfaces/UserAttributes.interface";

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'created_at'>;


class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public isActive!: boolean;
  public created_at!: Date;
  public account_type!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  account_type: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'Users',
  timestamps: false,
});

export default User;
