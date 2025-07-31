export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at?: Date;
  isActive: boolean;
  account_type: string;
}
