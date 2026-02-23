export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string; 
}

export interface RegisterRequest {
  username: string;
  password: string;
}