import { Button, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AddressManager from '~/components/@address/AddressManager';
import OrderSummary from '~/components/@checkout/OrderSummary';
import CouponManager from '~/components/CouponManager';
import DishListCard from '~/components/DishListCard';
import PageHeader from '~/components/PageHeader';
import { useOrder } from '~/contexts/order';
import { useSession } from '~/contexts/session';

const Checkout = () => {
  const { currentOrder, setAddress, makeOrder } = useOrder();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoading && !session.user) {
      notifications.show({
        message: 'Entre na sua conta para fazer o pedido',
        color: 'yellow',
      });
      router.push({
        pathname: '/login',
        query: {
          next: router.asPath,
        },
      });
      return;
    }
  }, [session.isLoading, session.user, router]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handleMakeOrder = async () => {
    if (!currentOrder.address.id) {
      notifications.show({
        message: 'Informe o endereço de entrega',
        color: 'yellow',
      });
      return;
    }
    setIsLoading(true);
    const order = await makeOrder();
    setIsLoading(false);
    setIsRedirecting(true);
    await router.replace(`/checkout/${order.id}`);
    setIsRedirecting(false);
  };

  const itemQuantity = currentOrder.dishes.length;

  return (
    <div className="flex flex-col gap-8">
      <LoadingOverlay visible={isRedirecting} />
      <PageHeader backTo="/cardapio">
        <h1>Fechar Pedido</h1>
      </PageHeader>
      {session.user?.role === 'employee' || session.user?.role === 'admin' ? (
        <div className="flex items-center gap-2 text-slate-600 text-center">
          <IconInfoCircle />
          <span>Você está registrando o pedido de um cliente</span>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 border border-slate-200 rounded-lg border-solid p-2">
        {itemQuantity === 0 ? (
          <>
            <span>Sem itens no pedido</span>
            <Link href="/cardapio">
              <Button>Ir para o cardápio</Button>
            </Link>
          </>
        ) : (
          <span className="font-semibold">Itens</span>
        )}
        {currentOrder.dishes.map((dish, i) => {
          return <DishListCard key={dish.id + i} dishId={dish.id} />;
        })}
      </div>
      {itemQuantity > 0 ? (
        <>
          <div className="flex flex-col border border-slate-200 rounded-lg border-solid p-2 gap-4">
            <span className="font-semibold">Endereço de entrega</span>
            <AddressManager
              onSelectAddress={(address) => setAddress(address)}
            />
          </div>
          <div className="flex flex-col border border-slate-200 rounded-lg border-solid p-2 gap-4">
            <span className="font-semibold">Cupom de desconto</span>
            <CouponManager />
          </div>
          <div className="flex flex-col border border-slate-200 rounded-lg border-solid p-2 gap-4">
            <span className="font-semibold">Resumo</span>
            <OrderSummary />
            <Button radius="md" loading={isLoading} onClick={handleMakeOrder}>
              Finalizar
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Checkout;
