import { auth } from './auth'; // Importa a configuração de auth.ts
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth'; // Importar o tipo Session

// Defina um tipo local que estende a sessão para incluir a propriedade 'error'
type AppSession = Session & {
  error?: string;
};

export default auth((req) => {
  // Pega o objeto de sessão completo e faz o cast para o nosso tipo estendido
  const session = req.auth as AppSession | null;
  // `isLoggedIn` é verdadeiro apenas se a sessão existir E não contiver um erro
  const isLoggedIn = !!session && !session.error;

  // Pega a URL que o usuário está tentando acessar
  const { pathname } = req.nextUrl;

  // --- Definição das Rotas ---

  // 1. Rotas públicas (não exigem autenticação)
  const publicRoutes = [
    '/login', // A sua página de login personalizada
    // Adicione aqui outras rotas públicas (ex: /landing-page, /sobre)
  ];

  // 2. Rotas da API de autenticação (sempre devem ser públicas)
  const authApiRoutes = [
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/error',
    '/api/auth/signout',
    '/api/auth/session',
  ];

  // --- Lógica de Redirecionamento ---

  // Verifica se a rota é da API de autenticação
  const isAuthApiRoute = authApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Se for uma rota da API de autenticação, deixa passar
  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  // Se for uma rota pública, deixa passar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // A partir daqui, todas as rotas são consideradas privadas.

  // Se a rota NÃO é pública E o usuário NÃO está logado (ou a sessão expirou com erro)
  if (!isLoggedIn) {
    if (session?.error) {
      console.log(
        'Middleware: Erro de sessão detectado (refresh falhou), redirecionando para /login.',
      );
    } else {
      console.log(
        'Middleware: Usuário não logado, redirecionando para /login.',
      );
    }

    // Redireciona para a página de login
    const loginUrl = new URL('/login', req.nextUrl.origin);

    return NextResponse.redirect(loginUrl);
  }

  // 4. Se está logado e acessando uma rota protegida (ou a raiz), deixa passar
  return NextResponse.next();
});

// O 'matcher' é crucial para performance.
// Ele filtra quais rotas devem executar o middleware.
export const config = {
  matcher: [
    // Executa o middleware em todas as rotas, EXCETO:
    // - /api/ (que não seja /api/auth/)
    // - _next/static (arquivos estáticos)
    // - _next/image (otimização de imagem)
    // - favicon.ico (ícone)
    // - .svg, .png, .jpg (outras imagens estáticas)
    '/((?!api(?!/auth)|_next/static|_next/image|.*\\.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
