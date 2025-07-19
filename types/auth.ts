export interface LoginRequest {
    email: string;
    senha: string;
  }
  
  export interface RegisterRequest {
    nome: string;
    email: string;
    senha: string;
    data_nascimento: string;
  }
  
  export interface AuthUser {
    id: string;
    nome: string;
    email: string;
    data_nascimento: string;
    status: string;
    data_registro: string;
  }
  
  export interface AuthResponse {
    user: AuthUser;
    token: string;
  }