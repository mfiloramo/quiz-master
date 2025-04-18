export type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};
