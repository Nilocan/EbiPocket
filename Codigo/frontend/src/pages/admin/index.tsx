import { Card, Title } from '@mantine/core';
import {
  IconChefHat,
  IconList,
  IconSoup,
  IconTicket,
  IconToolsKitchen2,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useSession } from '~/contexts/session';

const AdminHome = () => {
  const session = useSession();

  return (
    <div className="flex flex-col gap-3 items-center">
      <Title order={1}>Olá, {session.user?.name}</Title>
      <span className="text-lg text-center">Painel Admin</span>
      <div className="flex gap-4 flex-col mt-4">
        <Link href="/admin/cozinha" className="hover:no-underline text-center">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconChefHat />
              <span>Cozinha</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/pedidos" className="hover:no-underline text-center">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconList />
              <span>Gerenciar Pedidos</span>
            </div>
          </Card>
        </Link>
        <Link
          href="/admin/cardapios"
          className="hover:no-underline text-center"
        >
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconToolsKitchen2 />
              <span>Gerenciar Cardápios</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/pratos" className="hover:no-underline text-center">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconSoup />
              <span>Gerenciar Pratos</span>
            </div>
          </Card>
        </Link>
        <Link href="/admin/cupons" className="hover:no-underline text-center">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconTicket />
              <span>Gerenciar Cupons</span>
            </div>
          </Card>
        </Link>
        <Link
          href="/admin/funcionarios"
          className="hover:no-underline text-center"
        >
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex justify-center"
          >
            <div className="flex gap-2 items-center">
              <IconUsers />
              <span>Gerenciar Funcionários</span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
