import { useQuery } from '@tanstack/react-query';
import { DishData } from './@admin/DishForm';
import { unauthedClient } from '~/utils/api';
import { ActionIcon, Card, Image } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useOrder } from '~/contexts/order';

interface Props {
  dishId: string;
  removable?: boolean;
  compact?: boolean;
}

const DishListCard: React.FC<Props> = ({ dishId, removable, compact }) => {
  const { removeDishFromOrder } = useOrder();

  const { data } = useQuery<DishData>({
    queryKey: ['dish', dishId],
    queryFn: async () => {
      const res = await unauthedClient.get(`/dish/${dishId}`);

      return res.data;
    },
  });

  return (
    <Card withBorder radius="md" w="100%" padding={compact ? 5 : 'sm'}>
      <div className="flex justify-between gap-6">
        <div className="flex gap-2 items-center">
          <Image
            src={data?.file}
            alt="Foto Prato"
            radius="sm"
            width={compact ? 32 : 48}
            height={compact ? 32 : 48}
            className="border border-slate-300 border-solid rounded-md"
          />
          <span>{data?.name}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span>
            R$ <span className="font-semibold">{data?.price.toFixed(2)}</span>
          </span>
          {removable ? (
            <ActionIcon
              color="red"
              variant="subtle"
              radius="lg"
              title="Remover"
              onClick={() => removeDishFromOrder(dishId)}
            >
              <IconX size={16} />
            </ActionIcon>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default DishListCard;
