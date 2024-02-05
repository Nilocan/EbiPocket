import { Button, Modal, Table, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import OrderStatusManager from '~/components/@admin/OrderStatusManager';
import DishListCard from '~/components/DishListCard';
import PageHeader from '~/components/PageHeader';
import { OrderData } from '~/contexts/order';
import { authedClient } from '~/utils/api';

const ManageOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [detailedOrder, setDetailedOrder] = useState<OrderData | undefined>(
    undefined,
  );
  const [opened, { toggle }] = useDisclosure(false);

  const { data } = useQuery<OrderData[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await authedClient.get('/order/filter-status');

      return res.data;
    },
  });

  const handleShowDetails = (id: string) => {
    toggle();
    setDetailedOrder(data?.find((o) => o.id === id));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <Modal title="Detalhes do pedido" opened={opened} onClose={toggle}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 border border-slate-200 rounded-lg border-solid p-2">
            <span className="font-semibold">Itens</span>
            {detailedOrder?.dishes.map((dish) => {
              return (
                <DishListCard
                  key={dish.id}
                  dishId={dish.id}
                  removable={false}
                />
              );
            })}
          </div>
          <div className="flex flex-col gap-4 border border-slate-200 rounded-lg border-solid p-2">
            <span className="font-semibold">Endereço</span>
            <span>
              Entrega em {detailedOrder?.addressId.address.street},{' '}
              {detailedOrder?.addressId.address.number},{' '}
              {detailedOrder?.addressId.address.neighborhood}
            </span>
          </div>
        </div>
      </Modal>
      <PageHeader backTo="/admin">
        <Title order={1}>Gerenciar Pedidos</Title>
      </PageHeader>
      <TextInput
        placeholder="Pesquisar por código, cliente, status..."
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        value={searchQuery}
        className="w-full"
        icon={<IconSearch />}
        radius="md"
      />
      <div>
        <Table striped>
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data
              ?.filter(
                (o) =>
                  o.id.toLowerCase().includes(searchQuery) ||
                  o.userId.cpf.includes(searchQuery) ||
                  o.userId.name.toLowerCase().includes(searchQuery) ||
                  o.userId.email.toLocaleLowerCase().includes(searchQuery) ||
                  o.status.includes(searchQuery),
              )
              .map((order) => {
                return (
                  <tr key={order.id}>
                    <td>{order.id.split('-').at(0)}</td>
                    <td>{order.userId.cpf}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      <OrderStatusManager order={order} />
                    </td>
                    <td>
                      <Button
                        variant="subtle"
                        compact
                        onClick={() => handleShowDetails(order.id)}
                      >
                        Ver detalhes
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ManageOrder;
