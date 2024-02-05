import { Button, MultiSelect, TextInput } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authedClient } from '~/utils/api';
import { DishData } from './DishForm';

export interface MenuData {
  id: string;
  name: string;
  dishes: DishData[];
}

interface Props {
  menu?: MenuData;
  cancel: () => void;
}

const MenuForm: React.FC<Props> = ({ menu, cancel }) => {
  const [name, setName] = useState(menu?.name ?? '');
  const [dishes, setDishes] = useState<string[]>(
    menu?.dishes.map((dish) => dish.id) ?? [],
  );

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.post('/menu', { name });

      return res.data;
    },
    onSuccess: (menu) => {
      addDishesMutation.mutate(menu.id);
    },
  });
  const addDishesMutation = useMutation({
    mutationFn: async (menuId: string) => {
      const operations = dishes.map((dishId) => ({
        operation: 'ADD',
        dish_id: dishId,
      }));
      const res = await authedClient.post(`/menu/${menuId}/dishes`, {
        operations,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      cancel();
    },
  });

  const removeAllDishesMutation = useMutation({
    mutationFn: async () => {
      const operations = menu!.dishes.map((dish) => ({
        operation: 'REMOVE',
        dish_id: dish.id,
      }));
      const res = await authedClient.post(`/menu/${menu!.id}/dishes`, {
        operations,
      });

      return res.data;
    },
  });

  const { data: availableDishes } = useQuery<DishData[]>({
    queryKey: ['dishes'],
    queryFn: async () => {
      const res = await authedClient.get('/dish');

      return res.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu) createMutation.mutate();
    else {
      await removeAllDishesMutation.mutateAsync();
      addDishesMutation.mutate(menu.id);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          name="name"
          radius="md"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <MultiSelect
          label="Pratos"
          data={
            availableDishes?.map((dish) => ({
              value: dish.id,
              label: dish.name,
            })) ?? []
          }
          onChange={(ids) => setDishes(ids)}
          value={dishes}
          required
        />
        <Button radius="md" type="submit">
          {!menu ? 'Cadastrar' : 'Salvar'}
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

export default MenuForm;
