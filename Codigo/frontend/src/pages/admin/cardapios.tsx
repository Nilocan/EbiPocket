import { Button, Group, Modal, Popover, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import MenuForm, { MenuData } from '~/components/@admin/MenuForm';
import PageHeader from '~/components/PageHeader';
import { authedClient } from '~/utils/api';

const ManageMenu = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingMenu, setEditingDish] = useState<MenuData | undefined>(
    undefined,
  );

  const { data } = useQuery<MenuData[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const res = await authedClient.get('/menu');

      return res.data;
    },
  });

  const handleEdit = (id: string) => {
    setEditingDish(data?.find((menu) => menu.id === id));
    open();
  };

  const handleClose = () => {
    setEditingDish(undefined);
    close();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <PageHeader backTo="/admin">
        <Title order={1}>Gerenciar Cardápios</Title>
      </PageHeader>
      <Button onClick={open}>Cadastrar</Button>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${!editingMenu ? 'Cadastrar' : 'Editar'} Cardápio`}
      >
        <MenuForm cancel={handleClose} menu={editingMenu} />
      </Modal>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Pratos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((menu) => {
              return (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>
                    {menu.dishes.map((dish, i) => (
                      <span key={dish.id}>
                        {dish.name}
                        {i < menu.dishes.length - 1 ? ', ' : null}
                      </span>
                    ))}
                  </td>
                  <td>
                    <Group>
                      <Button
                        compact
                        color="yellow"
                        onClick={() => handleEdit(menu.id)}
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
                              // onClick={() => handleDelete(menu.id)}
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

export default ManageMenu;
