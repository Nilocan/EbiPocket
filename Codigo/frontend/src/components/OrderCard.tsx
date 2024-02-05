import { Button, Card, Collapse, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
  IconCircleFilled,
  IconDiscount,
  IconHash,
  IconInfoCircle,
  IconLivePhoto,
  IconMapPin,
  IconReceipt2,
} from '@tabler/icons-react';
import { OrderData, orderStatusLabel } from '~/contexts/order';
import DishListCard from './DishListCard';
import { orderColors } from './@admin/OrderStatusManager';

interface Props {
  order: OrderData;
}

const OrderCard: React.FC<Props> = ({ order }) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Card withBorder radius="md" className="flex flex-col gap-4 max-w-lg">
      <div className="flex justify-between items-center text-slate-800 gap-8">
        <div className="flex flex-col items-center">
          <IconHash />
          <span>{order.id.split('-').at(0)}</span>
        </div>
        <div className="flex flex-col items-center">
          <IconCalendar />
          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-col items-center">
          <IconReceipt2 />
          <span>{order.totalPrice.toFixed(2)}</span>
        </div>
        <Button
          variant="default"
          radius="md"
          onClick={toggle}
          leftIcon={
            opened ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />
          }
        >
          Ver detalhes
        </Button>
      </div>
      <Collapse in={opened} className="text-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2 mb-2">
            {order.dishes.map((dish) => {
              return <DishListCard key={dish.id} dishId={dish.id} compact />;
            })}
          </div>
          <div className="flex gap-2 items-center">
            <IconInfoCircle size={20} />
            <span>
              Status:{' '}
              <Text color={orderColors[order.status]} span>
                {orderStatusLabel[order.status]}
              </Text>
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <IconMapPin size={20} />
            <span>
              {order.addressId.address.street}, {order.addressId.address.number}
              , {order.addressId.address.neighborhood},{' '}
              {order.addressId.address.city}
            </span>
          </div>
          {!!order.couponName ? (
            <div className="flex gap-2 items-center">
              <IconDiscount size={20} />
              <span>Cupom utilizado: {order.couponName}</span>
            </div>
          ) : null}
        </div>
      </Collapse>
    </Card>
  );
};

export default OrderCard;
