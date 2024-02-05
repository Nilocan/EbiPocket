import { Button, PasswordInput, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { unauthedClient } from '~/utils/api';

const Cadastrar = () => {
  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormFields((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await unauthedClient.post('/user', formFields);

      return res.data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400)
          notifications.show({
            message: 'Confira os campos e tente novamente',
            color: 'red',
          });
      }
    },
    onSuccess(data) {
      notifications.show({
        message: 'Conta criada com sucesso. Faça login para continuar',
        color: 'green',
      });
      router.replace({
        pathname: '/login',
        query: { next: router.query?.loginNext },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate();
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h1>Criar sua conta</h1>
        <div>Informe os dados abaixo para fazer seu pedido</div>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          name="name"
          radius="md"
          required
          onChange={handleChange}
        />
        <TextInput
          label="Email"
          name="email"
          radius="md"
          required
          onChange={handleChange}
        />
        <TextInput
          label="CPF"
          name="cpf"
          radius="md"
          maxLength={11}
          required
          onChange={handleChange}
        />
        <PasswordInput
          label="Senha"
          name="password"
          radius="md"
          required
          onChange={handleChange}
        />
        <Button radius="md" type="submit">
          Cadastrar
        </Button>
        <Link href="/login" className="text-right text-sm">
          Login
        </Link>
      </form>
    </div>
  );
};

export default Cadastrar;
