// DECODED USER TYPE (MATCHES JWT PAYLOAD STRUCTURE)
export type DecodedUser = {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
};

// AUTH CONTEXT TYPE
export type AuthContextType = {
  isLoggedIn: boolean;
  user: DecodedUser | null;
  login: (token: string) => void;
  logout: () => void;
};
