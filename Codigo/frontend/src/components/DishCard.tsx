import { Badge, Button, Card, Image, Text, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSoup } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useOrder } from '~/contexts/order';
import { useSession } from '~/contexts/session';
import { DISH_CATEGORIES, DishData } from './@admin/DishForm';
import { useQuery } from '@tanstack/react-query';
import { authedClient } from '~/utils/api';
import { CouponData } from './CouponManager';

interface Props {
  dish: DishData;
  menuId: string;
}

const DishCard: React.FC<Props> = ({ dish, menuId }) => {
  const session = useSession();
  const { addDishToOrder } = useOrder();

  const { data } = useQuery<CouponData[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await authedClient.get('/coupon');

      return res.data;
    },
    enabled: !!session.user,
    placeholderData: [],
  });

  const handleAddToOrder = () => {
    addDishToOrder({ dish, menuId });
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder w={320}>
      <Card.Section className="relative">
        <Badge
          color="gray"
          variant="light"
          fz="sm"
          className="absolute right-2 top-2 z-10 text-xs capitalize border border-solid border-slate-300"
        >
          {DISH_CATEGORIES[dish.category]}
        </Badge>
        <Image src={dish.file} alt={`Foto ${dish.name}`} height={152} />
      </Card.Section>
      <div className="flex justify-between items-center mt-3">
        <Text weight={500} mr="sm">
          {dish.name}
        </Text>
        <Badge color="teal" variant="light" fz="sm">
          R$ {dish.price.toFixed(2)}
        </Badge>
      </div>
      <Text size="sm" color="dimmed">
        {dish.description}
      </Text>
      <Tooltip
        label={`Use o cupom ${
          data![Math.floor(Math.random() * data!.length)]?.name
        }`}
        disabled={!session.user}
      >
        <Button
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          onClick={handleAddToOrder}
        >
          Adicionar ao pedido
        </Button>
      </Tooltip>
    </Card>
  );
};

export default DishCard;
