import { signIn } from '@/auth';
import { Button } from '@/_shared/_components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_shared/_components/ui/card';

export default function SignIn() {
  const handleSignIn = async () => {
    'use server';
    await signIn('keycloak');
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Entrar</CardTitle>
          <CardDescription>
            Entre com sua conta Keycloak para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignIn}>
            <Button type="submit" className="w-full" size="lg">
              Entrar com Keycloak
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
