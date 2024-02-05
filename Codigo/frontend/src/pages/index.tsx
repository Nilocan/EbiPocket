import { Button } from '@mantine/core';
import Link from 'next/link';
import { useSession } from '~/contexts/session';

export default function Home() {
  const { user, logout } = useSession();

  return (
    <>
      <h1>Bem-vindo(a) ao Ebi Pocket!</h1>
      <Link href="/cardapio">
        <Button>Ver cardápio</Button>
      </Link>
    </>
  );
}
