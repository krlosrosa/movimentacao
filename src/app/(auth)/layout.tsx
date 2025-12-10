import QueryProviderReact from '@/_shared/_providers/query/QueryProvider';
import { UserProvider } from '@/_shared/_providers/UserContext';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // Agora 'session' já tem .id, .roles, etc.
  if (!session) {
    //redirect('login');
  }

  // NÃO PRECISA MAIS DO FETCH!
  // const res = await fetch(...)
  // const resuser = await res.json()

  // Você pode precisar ajustar o 'fetchUser' (mock) ou usá-lo
  // para pegar os 'centers', que parecem faltar na sessão.
  const user = {
    id: session?.user.id || '421931',
    name: session?.user.name || 'Carlos Roberto',
    roles: session?.user.roles || [],
    empresa: session?.user.empresa || null,
    centers: ['bauru'] as string[],
    centerSelect: 'bauru' as string | null,
  };

  return (
    <UserProvider initialUser={user}>
      <QueryProviderReact>
        {children}
      </QueryProviderReact>
    </UserProvider>
  );
}
