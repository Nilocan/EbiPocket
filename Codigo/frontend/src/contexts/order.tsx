import { useSessionStorage } from '@mantine/hooks';
import { createContext, ReactNode, useContext } from 'react';
import { UserData, useSession } from './session';
import { DishData } from '~/components/@admin/DishForm';
import { useMutation } from '@tanstack/react-query';
import { authedClient } from '~/utils/api';
import { notifications } from '@mantine/notifications';
import { AddressData } from '~/components/@address/AddressManager';
import { MenuData } from '~/components/@admin/MenuForm';
import { CouponData } from '~/components/CouponManager';

export type OrderStatus = 'open' | 'inTransit' | 'delivered' | 'cancelled';

export const orderStatusLabel: Record<OrderStatus, string> = {
  open: 'Em preparo',
  inTransit: 'A caminho',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export interface OrderData {
  id: string;
  totalPrice: number;
  previousPrice?: number | null;
  couponName?: string;
  userId: UserData;
  status: OrderStatus;
  dishes: DishData[];
  menuId: MenuData;
  addressId: {
    id: string;
    address: AddressData;
  };
  createdAt: string;
}

interface AddToCurrentOrderBody {
  menuId: string;
  dish: DishData;
}

interface DishInfo {
  id: string;
  price: number;
}

interface CurrentOrder {
  menuId: string;
  address: AddressData;
  dishes: DishInfo[];
  coupon: {
    couponName: string;
    totalWithCoupon: number;
  };
}

interface OrderContextData {
  currentOrder: CurrentOrder;
  resetOrder: () => void;
  addDishToOrder: (body: AddToCurrentOrderBody) => void;
  removeDishFromOrder: (dishId: string) => void;
  setAddress: (address: AddressData) => void;
  makeOrder: () => Promise<Partial<OrderData>>;
  applyCoupon: (coupon: CouponData) => void;
}

type OrderProviderProps = {
  children: ReactNode;
};

const OrderContext = createContext<OrderContextData>({} as OrderContextData);

const defaultValue = {
  menuId: '',
  address: {} as AddressData,
  dishes: [],
  coupon: {
    couponName: '',
    totalWithCoupon: 0,
  },
};

export function OrderProvider({ children }: OrderProviderProps) {
  const [currentOrder, setCurrentOrder] = useSessionStorage<CurrentOrder>({
    key: 'currentOrder',
    defaultValue,
  });

  const resetOrder = () => {
    setCurrentOrder(defaultValue);
  };

  const addDishToOrder = ({ dish, menuId }: AddToCurrentOrderBody) => {
    setCurrentOrder((order) => ({
      ...order,
      menuId,
      dishes: [...order.dishes, { id: dish.id, price: dish.price }],
    }));
  };

  const removeDishFromOrder = (dishId: string) => {
    setCurrentOrder((order) => ({
      ...order,
      dishes: order.dishes.filter((dish) => dish.id !== dishId),
    }));
  };

  const session = useSession();
  const createOrder = useMutation({
    mutationFn: async (order: object) => {
      const res = await authedClient.post('/order', order);

      return res.data;
    },
  });
  const addDishes = useMutation({
    mutationFn: async (body: object) => {
      const res = await authedClient.post('/order/add-dishes', body);

      return res.data;
    },
  });
  const applyCouponMutation = useMutation({
    mutationFn: async (body: object) => {
      const res = await authedClient.post('/order/coupon/add', body);

      return res.data;
    },
  });

  const setAddress = (address: AddressData) => {
    setCurrentOrder((order) => ({
      ...order,
      address,
    }));
  };

  const applyCoupon = (coupon: CouponData) => {
    const total = currentOrder.dishes.reduce(
      (total, dish) => total + dish.price,
      0,
    );
    setCurrentOrder((order) => ({
      ...order,
      coupon: {
        couponName: coupon.name,
        totalWithCoupon: total * (1 - coupon.discount / 100),
      },
    }));
  };

  const makeOrder = async () => {
    const order = {
      menuId: currentOrder.menuId,
      userId: session.user!.id,
      addressId: currentOrder.address.id,
      dishesIds: currentOrder.dishes.map((dish) => dish.id),
      couponName: currentOrder.coupon?.couponName,
    };

    try {
      const createdOrder = await createOrder.mutateAsync({
        menuId: order.menuId,
        userId: order.userId,
        addressId: order.addressId,
      });

      const dishes = await addDishes.mutateAsync({
        dishesIds: order.dishesIds,
        orderId: createdOrder.id,
      });

      if (order.couponName)
        await applyCouponMutation.mutateAsync({
          coupon_name: order.couponName,
          order_id: createdOrder.id,
        });

      setCurrentOrder(defaultValue);

      return {
        ...createdOrder,
        dishes,
      };
    } catch {
      notifications.show({ message: 'Erro ao criar pedido', color: 'red' });
      return;
    }
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        resetOrder,
        addDishToOrder,
        removeDishFromOrder,
        setAddress,
        makeOrder,
        applyCoupon,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  return context;
}
