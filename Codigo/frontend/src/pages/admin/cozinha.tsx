import { Badge, Button, Card, Group, Image, Text, Title } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import PageHeader from '~/components/PageHeader';
import { OrderData, OrderStatus } from '~/contexts/order';
import { authedClient } from '~/utils/api';

const Kitchen = () => {
  const { data } = useQuery<OrderData[]>({
    queryKey: ['openOrders'],
    queryFn: async () => {
      const res = await authedClient.get('/order/filter-status', {
        params: {
          status: 'open',
        },
      });

      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await authedClient.patch(`/order/update-status/${orderId}`, {
        newStatus: 'inTransit',
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openOrders'] });
    },
  });

  return (
    <div className="flex flex-col items-center gap-8">
      <PageHeader>
        <Title order={1}>Pedidos Pendentes</Title>
      </PageHeader>
      <div className="grid gap-8 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
        {!data?.length ? <span>Sem pedidos pendentes 🎉</span> : null}
        {data?.slice(0, 3).map((order) => {
          return (
            <Card
              key={order.id}
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
              className="self-start"
              w={350}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-semibold">
                    Pedido #{order.id.split('-').at(0)}
                  </span>
                </div>

                {order.dishes.map((dish) => {
                  return (
                    <Card
                      key={dish.id}
                      padding="sm"
                      radius="md"
                      withBorder
                      className="flex gap-4"
                    >
                      <Image
                        src={dish.file}
                        alt="Foto"
                        width={30}
                        height={30}
                        radius="sm"
                        className="border border-solid border-slate-300 rounded-md"
                      />
                      <span className="text-lg">{dish.name}</span>
                    </Card>
                  );
                })}
                <Button
                  onClick={() => mutation.mutate(order.id)}
                  radius="md"
                  leftIcon={<IconCheck />}
                  mt="md"
                  loading={
                    mutation.isPending && mutation.variables === order.id
                  }
                >
                  Feito
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Kitchen;
