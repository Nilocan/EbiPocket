import { Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSession } from '~/contexts/session';
import { authedClient } from '~/utils/api';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';

export interface AddressData {
  id: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  userId: string;
}

interface Props {
  onSelectAddress: (address: AddressData) => void;
}

const AddressManager: React.FC<Props> = ({ onSelectAddress }) => {
  const { user } = useSession();
  const { data } = useQuery<AddressData[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await authedClient.get(`/address/user/${user?.id}`);

      return res.data;
    },
    enabled: !!user,
  });

  const [isNew, setIsNew] = useState(false);
  const handleSelect = (address: AddressData) => {
    onSelectAddress(address);
    setIsNew(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {data?.map((addr) => {
          return (
            <AddressCard
              key={addr.id}
              address={addr}
              onSelect={() => handleSelect(addr)}
            />
          );
        })}
      </div>
      <Button
        variant="outline"
        radius="md"
        color={!isNew ? 'blue' : 'red'}
        onClick={() => setIsNew((state) => !state)}
      >
        {!isNew ? 'Novo Endereço' : 'Cancelar'}
      </Button>
      {isNew ? <AddressForm onCreated={() => setIsNew(false)} /> : null}
    </div>
  );
};

export default AddressManager;
