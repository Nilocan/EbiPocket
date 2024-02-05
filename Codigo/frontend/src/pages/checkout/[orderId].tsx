import { Button, Collapse, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleCheck, IconHash, IconMapPin } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OrderData, OrderStatus, orderStatusLabel } from '~/contexts/order';
import { useSession } from '~/contexts/session';
import { authedClient } from '~/utils/api';

const OrderCreated = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [detailsOpened, { toggle }] = useDisclosure(false);

  const { data } = useQuery<OrderData>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await authedClient.get(`/order/${orderId}`);

      return res.data;
    },
    refetchInterval: 60 * 1000,
    enabled: !!orderId,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      const res = await authedClient.patch(`/order/update-status/${orderId}`, {
        newStatus,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });

  const session = useSession();
  const isFromEmployee = !!session.user;

  const ActionButton = () => {
    if (data?.status === 'cancelled' || data?.status === 'delivered')
      return null;

    if (data?.status === 'open')
      return (
        <Button
          onClick={() => mutation.mutate('cancelled')}
          variant="outline"
          color="red"
          compact
        >
          Cancelar pedido
        </Button>
      );

    if (data?.status === 'inTransit')
      return (
        <Button onClick={() => mutation.mutate('delivered')} variant="outline">
          Confirmar entrega
        </Button>
      );
  };

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="flex flex-col items-center">
        <IconCircleCheck className="text-green-400" size="64" />
        <h1>Pedido feito com sucesso!</h1>
      </div>
      <div className="flex flex-col gap-2 border border-solid border-slate-300 rounded-md p-4 items-center">
        {data?.status === 'cancelled' || data?.status === 'delivered' ? (
          <div>
            <span className="text-lg">
              O pedido foi{' '}
              <span className="font-semibold">
                {orderStatusLabel[data.status]}
              </span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="bg-green-500 animate-pulse w-3 h-3 rounded-full" />
            <span className="text-lg">
              {!isFromEmployee ? 'Seu' : 'O'} pedido está{' '}
              <span className="font-semibold">
                {orderStatusLabel[data?.status ?? 'open']}
              </span>
            </span>
          </div>
        )}
        <div className="mt-2 flex flex-col gap-2 items-center">
          {!isFromEmployee ? (
            <div>
              <span>O pagamento será feito no momento da entrega</span>
            </div>
          ) : null}
          <div>
            <span className="text-lg">
              Valor total do pedido: R${' '}
              <span className="font-semibold">
                {data?.totalPrice.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
        <div className="my-2">
          <ActionButton />
        </div>
        <UnstyledButton onClick={toggle} className="hover:underline">
          {detailsOpened ? 'Ocultar' : 'Ver'} detalhes
        </UnstyledButton>
        <Collapse
          in={detailsOpened}
          className="flex flex-col gap-2 text-slate-600 text-left"
        >
          <div className="flex gap-2 items-center">
            <IconMapPin size={20} />
            <span>
              {data?.addressId.address.street}, {data?.addressId.address.number}
              , {data?.addressId.address.neighborhood},{' '}
              {data?.addressId.address.city}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <IconHash size={20} />
            <span>{data?.id.split('-').at(0)}</span>
          </div>
        </Collapse>
      </div>
      <Link href="/cardapio">Ver cardápio</Link>
    </div>
  );
};

export default OrderCreated;
