import { useOrder } from '~/contexts/order';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Button } from '@mantine/core';

const OrderSummary = () => {
  const { currentOrder } = useOrder();

  const itemQuantity = currentOrder.dishes.length;
  const total = currentOrder.dishes.reduce(
    (total, dish) => total + dish.price,
    0,
  );
  const couponApplied = !!currentOrder.coupon?.couponName;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <span>
          Itens: <span className="font-semibold">{itemQuantity}</span>
        </span>
      </div>
      {currentOrder.address.id ? (
        <div>
          <span>
            Entregar em {currentOrder.address.street},{' '}
            {currentOrder.address.number}
          </span>
        </div>
      ) : null}
      <div>
        <span>
          Total:{' '}
          <span
            className={`font-semibold ${
              couponApplied ? 'line-through text-slate-700' : ''
            }`}
          >
            R$ {total.toFixed(2)}
          </span>
          {couponApplied ? (
            <span className="font-semibold">
              {' '}
              R$ {currentOrder.coupon.totalWithCoupon.toFixed(2)}
            </span>
          ) : null}
          <span className="text-slate-800 text-sm">
            {' '}
            (Pagamento na entrega)
          </span>
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
