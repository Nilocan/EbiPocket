import { Button, PasswordInput, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSession } from '~/contexts/session';

const Login = () => {
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const { login } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.email || !formFields.password) return;

    if (await login(formFields))
      router.replace(router.query.next?.toString() ?? '/');
  };

  return (
    <>
      <div>
        <h1>Entrar na sua conta</h1>
        <form className="flex flex-col gap-4">
          <TextInput
            label="Email"
            radius="md"
            onChange={(e) =>
              setFormFields((state) => ({ ...state, email: e.target.value }))
            }
            required
            withAsterisk={false}
          />
          <PasswordInput
            label="Senha"
            radius="md"
            onChange={(e) =>
              setFormFields((state) => ({ ...state, password: e.target.value }))
            }
            required
            withAsterisk={false}
          />
          <Button type="submit" radius="md" onClick={handleSubmit}>
            Entrar
          </Button>
          <Link
            href={{
              pathname: '/cadastrar',
              query: { loginNext: router.query?.next },
            }}
            className="text-right text-sm"
          >
            Criar conta
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
