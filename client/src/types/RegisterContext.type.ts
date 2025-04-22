export type RegisterContextType = {
  account_type: 'student' | 'teacher' | null;
  username: string;
  email: string;
  password: string;
  setAccountType: (type: 'student' | 'teacher') => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
};
