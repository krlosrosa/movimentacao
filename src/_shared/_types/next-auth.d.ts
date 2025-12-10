import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

/**
 * 1. Estende o tipo do TOKEN (JWT)
 * Este tipo é usado no objeto 'token' dentro do callback 'jwt'.
 */
declare module 'next-auth/jwt' {
  interface JWT {
    /** ID do usuário vindo do seu backend */
    id: string | null;
    /** Permissões (roles) do usuário */
    roles: string[] | null;
    /** Empresa do usuário */
    empresa: 'DPA' | 'ITB' | 'LDB' | null;
    /** O token de acesso do seu backend */
    accessToken: string;
    /** A data de expiração do token de acesso */
    accessTokenExpires: number;
    /** O refresh token do seu backend */
    refreshToken: string;
    /** Erro de autenticação (ex: RefreshAccessTokenError, MissingRefreshTokenError, etc.) */
    error?: string;
  }
}

/**
 * 2. Estende o tipo da SESSÃO
 * Este tipo é usado no objeto 'session' retornado por 'await auth()'
 * e no callback 'session'.
 */
declare module 'next-auth' {
  interface Session {
    user: {
      /** ID do usuário vindo do seu backend */
      id: string | null;
      /** Empresa do usuário */
      empresa: 'DPA' | 'ITB' | 'LDB' | null;
      /** Permissões (roles) do usuário */
      roles: string[] | null;
      /** O token de acesso do seu backend */
      accessToken: string;
    } & DefaultSession['user']; // Combina com os tipos padrão (name, email, image)
    /** Erro de autenticação (ex: RefreshAccessTokenError, MissingRefreshTokenError, etc.) */
    error?: string;
  }
}
