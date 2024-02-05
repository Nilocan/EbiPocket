import { Button, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { AddressData } from './AddressManager';
import { authedClient } from '~/utils/api';
import { useSession } from '~/contexts/session';

interface AddressForm extends AddressData {
  edited: boolean;
}

interface Props {
  onCreated: () => void;
}

const AddressForm: React.FC<Props> = ({ onCreated }) => {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({} as AddressForm);

  const handleCepChange = (value: string) => {
    setCep(value);
    setAddress((addr) => ({ ...addr, edited: false }));
  };
  const validCep = cep.length === 8;

  const cepQuery = useQuery({
    queryKey: ['cep', cep],
    queryFn: async () => {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      const { data } = res;
      setAddress({
        ...address,
        cep,
        street: data.logradouro,
        number: '',
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      });

      return data;
    },
    enabled: !!validCep && !address.edited,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((address) => ({
      ...address,
      [e.target.name]: e.target.value,
      edited: true,
    }));
  };

  const { user } = useSession();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.post('/address', {
        ...address,
        userId: user?.id,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onCreated();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validCep) return;
    mutation.mutate();
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <TextInput
        label="CEP"
        radius="md"
        onChange={(e) => handleCepChange(e.target.value)}
        value={cep}
      />
      <TextInput
        label="Rua"
        radius="md"
        name="street"
        disabled={!validCep}
        value={address.street}
        onChange={handleChange}
      />
      <TextInput
        label="Número"
        radius="md"
        name="number"
        disabled={!validCep}
        value={address.number}
        onChange={handleChange}
      />
      <TextInput
        label="Bairro"
        radius="md"
        name="neighborhood"
        disabled={!validCep}
        value={address.neighborhood}
        onChange={handleChange}
      />
      <TextInput
        label="Cidade"
        radius="md"
        name="city"
        disabled={!validCep}
        value={address.city}
        onChange={handleChange}
      />
      <TextInput
        label="Estado"
        radius="md"
        name="state"
        disabled={!validCep}
        value={address.state}
        onChange={handleChange}
      />
      <Button radius="md" className="mt-2" variant="outline" type="submit">
        Salvar Endereço
      </Button>
    </form>
  );
};

export default AddressForm;
