import {
  Button,
  DefaultMantineColor,
  LoadingOverlay,
  Popover,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderData, OrderStatus, orderStatusLabel } from '~/contexts/order';
import { authedClient } from '~/utils/api';

interface Props {
  order: OrderData;
}

export const orderColors: Record<OrderStatus, DefaultMantineColor> = {
  open: 'red',
  inTransit: 'yellow',
  delivered: 'cyan',
  cancelled: 'gray',
};

const OrderStatusManager: React.FC<Props> = ({ order }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newStatus: OrderStatus) => {
      const res = await authedClient.patch(`/order/update-status/${order.id}`, {
        newStatus,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return (
    <Popover>
      <Popover.Target>
        <Button
          variant="subtle"
          color={orderColors[order.status]}
          rightIcon={<IconChevronDown size={20} />}
          compact
        >
          {orderStatusLabel[order.status]}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-col items-start gap-2">
          <LoadingOverlay visible={mutation.isPending} />
          {Object.entries(orderStatusLabel).map(([key, label]) => {
            if (key === order.status) return null;

            return (
              <Button
                key={key}
                variant="white"
                compact
                color={orderColors[key as OrderStatus]}
                onClick={() => mutation.mutate(key as OrderStatus)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default OrderStatusManager;
