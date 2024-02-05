import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTicket } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useOrder } from '~/contexts/order';
import { authedClient } from '~/utils/api';

export interface CouponData {
  name: string;
  discount: number;
  minValue: number;
}

const CouponManager = () => {
  const [couponName, setCouponName] = useState('');

  const { data: coupons, isLoading } = useQuery<CouponData[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await authedClient.get('/coupon');

      return res.data;
    },
  });

  const { currentOrder, applyCoupon } = useOrder();

  const handleApplyCoupon = () => {
    if (!couponName) return;

    const coupon = coupons?.find((c) => c.name === couponName);

    if (!coupon) {
      notifications.show({
        message: 'Cupom inválido',
        color: 'red',
      });
      return;
    }

    const total = currentOrder.dishes.reduce(
      (total, dish) => total + dish.price,
      0,
    );
    if (total < coupon.minValue) {
      notifications.show({
        message: `O valor mínimo para esse cupom é R$ ${coupon.minValue.toFixed(
          2,
        )}`,
        color: 'red',
      });
      return;
    }

    applyCoupon(coupon);
    notifications.show({
      message: 'Cupom aplicado com sucesso!',
      color: 'green',
    });
  };

  const disabled = isLoading || !!currentOrder.coupon?.couponName;

  return (
    <div className="flex gap-2">
      <TextInput
        className="flex-1"
        placeholder="Usar Cupom"
        icon={<IconTicket />}
        radius="md"
        disabled={disabled}
        value={disabled ? currentOrder.coupon?.couponName : couponName}
        onChange={(e) => setCouponName(e.target.value)}
      />
      <Button
        radius="md"
        variant="outline"
        disabled={disabled}
        onClick={handleApplyCoupon}
      >
        {disabled ? 'Aplicado' : 'Aplicar'}
      </Button>
    </div>
  );
};

export default CouponManager;
