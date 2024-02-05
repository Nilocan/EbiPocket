import { useQuery } from '@tanstack/react-query';
import OrderCard from '~/components/OrderCard';
import PageHeader from '~/components/PageHeader';
import { OrderData } from '~/contexts/order';
import { useSession } from '~/contexts/session';
import { authedClient } from '~/utils/api';

const Orders = () => {
  const { user } = useSession();

  const { data } = useQuery<OrderData[]>({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await authedClient.get(`/order/history/${user?.id}`);

      return res.data;
    },
    enabled: !!user,
  });

  return (
    <div className="flex flex-col items-center gap-4 px-8 pb-8">
      <PageHeader>
        <h1 className="text-xl md:text-3xl">Seus Pedidos</h1>
      </PageHeader>
      {data?.map((order) => {
        return <OrderCard key={order.id} order={order} />;
      })}
    </div>
  );
};

export default Orders;
