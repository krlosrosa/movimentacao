import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';

/**
 * Lógica de renovação de token de acesso.
 * @param token O token JWT atual do NextAuth
 */
async function refreshAccessToken(token: any) {
  try {
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER as string;
    if (!issuer) {
      throw new Error('AUTH_KEYCLOAK_ISSUER não está definido');
    }

    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_KEYCLOAK_ID as string,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });

    const newTokens = await response.json();

    if (!response.ok) {
      throw new Error(
        `Falha ao renovar token: ${response.status} ${
          newTokens.error_description || newTokens.error
        }`,
      );
    }

    // Atualiza o token com os novos valores
    return {
      ...token, // Preserva dados antigos (como id, roles)
      accessToken: newTokens.access_token,
      accessTokenExpires: Date.now() + newTokens.expires_in * 1000,
      // Opcional: Keycloak pode ou não retornar um novo refresh token
      refreshToken: newTokens.refresh_token ?? token.refreshToken,
      error: null, // Limpa qualquer erro anterior
    };
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    // Define um erro no token. A sessão será invalidada ou o usuário será deslogado
    // dependendo de como o 'session' callback e o frontend lidam com isso.
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,

  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID as string,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET as string,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER as string, // Exemplo: https://keycloak.ragde.app/realms/dev
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hora
    updateAge: 30 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Bloco 1: Login Inicial (quando account e user existem)
      if (account && user) {
        token.accessToken = account.access_token as string;
        // Corrigido: Salvar o TIMESTAMP de expiração, não a duração
        token.accessTokenExpires =
          Date.now() + (account.expires_in as number) * 1000;
        token.refreshToken = account.refresh_token as string;

        const backendUrl = process.env.EXTERNAL_API_BASE_URL;

        if (!backendUrl) {
          console.error(
            'ERRO CRÍTICO: EXTERNAL_API_BASE_URL não está definida.',
          );
          token.id = null;
          token.roles = null;
          token.error = 'MissingBackendURLError';
          return token; // Retorna token com erro
        }

        try {
          const res = await fetch(`${backendUrl}/api/user/info-me`, {
            headers: { Authorization: `Bearer ${account.access_token}` },
            signal: AbortSignal.timeout(3000), // 3 segundos
          });

          if (!res.ok) {
            throw new Error(`Backend /info-me respondeu com ${res.status}`);
          }

          const userInfo = await res.json();
          // Caminho feliz: dados populados no token
          token.id = userInfo.id;
          token.roles = userInfo.roles;
          token.empresa = userInfo.empresa;
          delete token.error; // Limpa qualquer erro anterior
        } catch (error) {
          console.error('Erro ao buscar /info-me no login:', error);
          token.id = null;
          token.roles = null;
          token.empresa = null;
          token.error = 'FetchUserInfoError';
        }

        // Retorna o token populado do login
        return token;
      }

      // Bloco 2: Requisições Subsequentes (sessão já existe)

      // Verifica se o token ainda é válido (com uma margem de segurança de 10s)
      const isTokenValid =
        Date.now() < (token.accessTokenExpires as number) - 10000;
      if (isTokenValid) {
        return token;
      }

      if (!token.refreshToken) {
        console.error('Bloco JWT: Refresh token não encontrado.');
        token.error = 'MissingRefreshTokenError';
        return token;
      }

      // Chama a função de renovação
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      // 'token' é o que você acabou de criar/atualizar no callback 'jwt'
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[] | null;
        session.user.accessToken = token.accessToken as string;
        session.user.empresa = token.empresa as 'DPA' | 'ITB' | 'LDB' | null;
        // Propaga o erro para a sessão, para que o frontend possa reagir
        // Ex: Redirecionar para /login se houver um erro de refresh
        if (token.error) {
          session.error = token.error as string;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  events: {
    async signOut(message) {
      // Sua lógica de signOut existente
      if ('token' in message && message.token?.accessToken) {
        try {
          const decoded = jwtDecode(message.token?.accessToken);
          const sub = decoded.sub;
          if (!sub) return;

          const url = `${process.env.EXTERNAL_API_BASE_URL}/api/user/logout/${sub}`;
          const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${message.token?.accessToken}`,
            },
          });
        } catch (error) {
          console.error('Erro no evento signOut (backend logout):', error);
        }
      }
    },
  },

  pages: {
    signIn: '/login',
  },
});
