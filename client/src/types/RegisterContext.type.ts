export type RegisterContextType = {
  accountType: 'student' | 'teacher' | null;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  setAccountType: (type: 'student' | 'teacher') => void;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  reset: () => void;
};
