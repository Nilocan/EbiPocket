import { Card, CardProps, DefaultProps } from '@mantine/core';
import { AddressData } from './AddressManager';
import { IconCheck } from '@tabler/icons-react';
import { useOrder } from '~/contexts/order';

interface Props {
  address: AddressData;
  onSelect: () => void;
}

const AddressCard: React.FC<Props> = ({ address, onSelect }) => {
  const { currentOrder } = useOrder();

  const selected = currentOrder.address.id === address.id;

  return (
    <Card
      withBorder
      radius="md"
      w="100%"
      style={{ cursor: 'pointer' }}
      onClick={onSelect}
      className={`hover:bg-slate-50 transition-all active:shadow-none ${
        selected ? 'bg-slate-50 shadow-none' : ''
      }`}
    >
      <div className="flex gap-3">
        {selected ? <IconCheck /> : null}
        <span>
          {address.street}, {address.number}
        </span>
      </div>
    </Card>
  );
};

export default AddressCard;
