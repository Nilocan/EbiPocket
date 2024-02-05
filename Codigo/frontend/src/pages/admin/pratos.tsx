import {
  Button,
  Group,
  HoverCard,
  Image,
  Modal,
  Popover,
  Table,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DishForm, {
  DISH_CATEGORIES,
  DishData,
} from '~/components/@admin/DishForm';
import PageHeader from '~/components/PageHeader';
import { authedClient } from '~/utils/api';

const ManageDishes = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingDish, setEditingDish] = useState<DishData | undefined>(
    undefined,
  );

  const { data } = useQuery<DishData[]>({
    queryKey: ['dishes'],
    queryFn: async () => {
      const res = await authedClient.get('/dish');

      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authedClient.delete(`/dish/${id}`);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    setEditingDish(data?.find((dish) => dish.id === id));
    open();
  };

  const handleClose = () => {
    setEditingDish(undefined);
    close();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <PageHeader backTo="/admin">
        <Title order={1}>Gerenciar Pratos</Title>
      </PageHeader>
      <Button onClick={open}>Cadastrar</Button>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={`${!editingDish ? 'Cadastrar' : 'Editar'} Prato`}
      >
        <DishForm cancel={handleClose} dish={editingDish} />
      </Modal>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((dish) => {
              return (
                <tr key={dish.id}>
                  <td>
                    <HoverCard>
                      <HoverCard.Target>
                        <Image
                          src={dish.file}
                          alt="Foto"
                          radius="sm"
                          width={32}
                          height={32}
                        />
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Image
                          src={dish.file}
                          alt="Foto"
                          radius="sm"
                          width={152}
                          height={152}
                        />
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </td>
                  <td>{dish.name}</td>
                  <td>{dish.description}</td>
                  <td>{DISH_CATEGORIES[dish.category]}</td>
                  <td>{dish.price.toFixed(2)}</td>
                  <td>
                    <Group>
                      <Button
                        compact
                        color="yellow"
                        onClick={() => handleEdit(dish.id)}
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
                              onClick={() => handleDelete(dish.id)}
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

export default ManageDishes;
