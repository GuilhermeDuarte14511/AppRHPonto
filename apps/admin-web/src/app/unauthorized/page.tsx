import Link from 'next/link';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rh-ponto/ui';

const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Acesso restrito</CardTitle>
        <CardDescription>Este ambiente administrativo aceita apenas perfis com role de administrador.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button asChild>
          <Link href="/login">Voltar ao login</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default UnauthorizedPage;

