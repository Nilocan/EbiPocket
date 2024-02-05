import { useLocalStorage } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import SplashScreen from '~/components/SplashScreen';
import { authedClient, unauthedClient } from '~/utils/api';

interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  cpf: string;
  role: 'admin' | 'employee' | 'customer';
}

interface SessionContextData {
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  token: string;
  user?: UserData;
  isLoading: boolean;
}

interface SessionProviderProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContextData>(
  {} as SessionContextData,
);

export function SessionProvider({ children }: SessionProviderProps) {
  const [token, setToken] = useLocalStorage({
    key: 'access_token',
    defaultValue: '',
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<UserData>({
    queryKey: ['userData'],
    queryFn: async () => {
      const res = await authedClient.get('/auth/info');

      return res.data;
    },
    refetchOnMount: !!token,
    refetchOnWindowFocus: !!token,
    retry(failureCount, error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          logout();
          return false;
        }
        return true;
      }
      return failureCount > 2 ? false : true;
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (
      !isLoading &&
      router.pathname.includes('admin') &&
      data?.role !== 'admin' &&
      data?.role !== 'employee'
    ) {
      router.replace('/');
    }
  }, [isLoading, router, data?.role]);

  const login = async (data: LoginData) => {
    try {
      const res = await unauthedClient.post('/auth', data);

      if (!res.data.access_token) return false;

      setToken(res.data.access_token);
      queryClient.invalidateQueries({ queryKey: ['userData'] });

      return true;
    } catch (err) {
      let message = 'Erro ao autenticar';
      if (err instanceof AxiosError && err.response?.status === 401)
        message = 'Credenciais inválidas';
      notifications.show({
        message,
        color: 'red',
      });
      return false;
    }
  };

  const logout = () => {
    setToken('');
    queryClient.setQueryData(['userData'], () => null);
  };

  return (
    <SessionContext.Provider
      value={{ login, logout, token, user: data, isLoading }}
    >
      {router.pathname.includes('admin') && isLoading ? (
        <SplashScreen />
      ) : (
        <>{children}</>
      )}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  return context;
}
