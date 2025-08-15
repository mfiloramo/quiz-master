// AUTH CONTEXT TYPE
export type AuthContextType = {
  isLoggedIn: boolean;
  user: DecodedUser | null;
  login: (token: string) => boolean;
  logout: () => void;
  isHost: boolean;
  setIsHost: (hostStatus: boolean) => void;
};

// DECODED USER TYPE (MATCHES JWT PAYLOAD STRUCTURE)
export type DecodedUser = {
  id: number | string;
  username: string;
  email: string;
  isActive: boolean;
  account_type: string;
  iat: number;
  exp: number;
};
