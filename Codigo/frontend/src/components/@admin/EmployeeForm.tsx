import { Button, PasswordInput, TextInput } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { UserData } from '~/contexts/session';
import { authedClient } from '~/utils/api';

interface Props {
  user?: UserData;
  cancel: () => void;
}

const EmployeeForm: React.FC<Props> = ({ user, cancel }) => {
  const [formFields, setFormFields] = useState(user ?? ({} as UserData));

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.post('/user/employee', {
        ...formFields,
        role: 'employee',
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      cancel();
    },
  });
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.put(`/user/employee/${user?.id}`, {
        ...formFields,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      cancel();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormFields((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) createMutation.mutate();
    else updateMutation.mutate();
  };

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          name="name"
          radius="md"
          required
          onChange={handleChange}
          value={formFields.name}
        />
        <TextInput
          label="Email"
          name="email"
          radius="md"
          required
          onChange={handleChange}
          value={formFields.email}
        />
        <TextInput
          label="CPF"
          name="cpf"
          radius="md"
          maxLength={11}
          required
          onChange={handleChange}
          value={formFields.cpf}
        />
        {!user ? (
          <PasswordInput
            label="Senha"
            name="password"
            radius="md"
            required
            onChange={handleChange}
          />
        ) : null}
        <Button radius="md" type="submit">
          {!user ? 'Cadastrar' : 'Salvar'}
        </Button>
        <Button
          radius="md"
          type="button"
          color="red"
          variant="outline"
          onClick={cancel}
        >
          Cancelar
        </Button>
      </form>
    </div>
  );
};

export default EmployeeForm;
