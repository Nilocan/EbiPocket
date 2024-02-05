import { Button, Group, Modal, Popover, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EmployeeForm from '~/components/@admin/EmployeeForm';
import { UserData } from '~/contexts/session';
import { authedClient } from '~/utils/api';
import { useState } from 'react';
import PageHeader from '~/components/PageHeader';

const ManageEmployees = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<UserData | undefined>(
    undefined,
  );

  const { data } = useQuery<UserData[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await authedClient.get('/user/employees');

      return res.data;
    },
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authedClient.delete(`/user/employee/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    setEditingUser(data?.find((user) => user.id === id));
    open();
  };

  const handleClose = () => {
    setEditingUser(undefined);
    close();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <PageHeader backTo="/admin">
        <Title order={1}>Gerenciar Funcionários</Title>
      </PageHeader>
      <Button onClick={open}>Cadastrar</Button>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${!editingUser ? 'Cadastrar' : 'Editar'} Funcionário`}
      >
        <EmployeeForm cancel={handleClose} user={editingUser} />
      </Modal>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.cpf}</td>
                  <td>
                    <Group>
                      <Button
                        compact
                        color="yellow"
                        onClick={() => handleEdit(user.id)}
                      >
                        Editar
                      </Button>
                      <Popover>
                        <Popover.Target>
                          <Button compact color="red">
                            Deletar
                          </Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                          <Group>
                            <span>Tem certeza?</span>
                            <Button
                              compact
                              color="red"
                              variant="outline"
                              onClick={() => handleDelete(user.id)}
                            >
                              Sim
                            </Button>
                          </Group>
                        </Popover.Dropdown>
                      </Popover>
                    </Group>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ManageEmployees;
