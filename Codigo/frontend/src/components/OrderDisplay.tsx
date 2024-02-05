import { Button } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useOrder } from '~/contexts/order';

const OrderDisplay = () => {
  const { currentOrder, resetOrder } = useOrder();
  const router = useRouter();

  const itemQuantity = currentOrder.dishes.length;
  const total = currentOrder.dishes.reduce(
    (total, dish) => total + dish.price,
    0,
  );

  const show = itemQuantity > 0 && router.pathname !== '/checkout';

  return (
    <div
      className={`flex justify-between items-center p-4 border w-full fixed z-20 ${
        show ? 'bottom-0' : '-bottom-full'
      } border-slate-300 border-solid shadow shadow-slate-400 transition-all bg-white`}
    >
      <span className="font-semibold hidden md:inline">Pedido</span>
      <span>
        <span>
          <span className="font-semibold">{itemQuantity}</span> ite
          {itemQuantity === 1 ? 'm' : 'ns'}
        </span>{' '}
        - R$ <span className="font-semibold">{total.toFixed(2)}</span>
      </span>
      <div className="flex gap-3">
        <Button variant="outline" color="red" compact onClick={resetOrder}>
          Cancelar
        </Button>
        <Link href="/checkout">
          <Button compact>Fechar pedido</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDisplay;
