import { Button, HoverCard, Skeleton } from '@mantine/core';
import { IconHistory, IconIdBadge2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from '~/contexts/session';

const UserMenu = () => {
  const { user, token, logout } = useSession();
  const router = useRouter();

  if (!token)
    return (
      <Link href={{ pathname: '/login', query: { next: router.asPath } }}>
        <Button compact variant="subtle">
          Entrar na sua conta
        </Button>
      </Link>
    );

  if (!user?.id) return <Skeleton height={10} width={120} />;

  return (
    <div>
      <HoverCard position="bottom-end">
        <HoverCard.Target>
          <span className="cursor-default">
            Olá, <span className="font-semibold">{user.name}</span>
          </span>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {user.role === 'admin' || user.role === 'employee' ? (
                <Link
                  href="/admin"
                  className="text-slate-700 flex items-center gap-2"
                >
                  <IconIdBadge2 />
                  <span>Painel Admin</span>
                </Link>
              ) : null}
              <Link
                href="/pedidos"
                className="text-slate-700 flex items-center gap-2"
              >
                <IconHistory />
                <span>Seus Pedidos</span>
              </Link>
            </div>
            <Button variant="outline" compact onClick={logout}>
              Sair
            </Button>
          </div>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default UserMenu;
