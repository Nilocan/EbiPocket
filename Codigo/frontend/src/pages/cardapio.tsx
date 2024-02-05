import { Chip, ScrollArea, Tabs, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DISH_CATEGORIES } from '~/components/@admin/DishForm';
import { MenuData } from '~/components/@admin/MenuForm';
import DishCard from '~/components/DishCard';
import PageHeader from '~/components/PageHeader';
import { unauthedClient } from '~/utils/api';

type KeyType = keyof typeof DISH_CATEGORIES;

const Menu = () => {
  const [activeTab, setActiveTab] = useState<string | null>(
    'Cardápio principal',
  );
  const [categories, setCategories] = useState<Record<KeyType, boolean>>({
    appetizer: true,
    toShare: true,
    mainDish: true,
    dessert: true,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data } = useQuery<MenuData[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const res = await unauthedClient.get('/menu');

      return res.data;
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 px-8 pb-8">
      <PageHeader hideBackButton>
        <h1 className="text-xl md:text-3xl">Confira nossos pratos</h1>
      </PageHeader>
      <TextInput
        icon={<IconSearch />}
        placeholder="Pesquisar pratos, ingredientes, categorias..."
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        radius="md"
        w="100%"
      />
      <div className="flex gap-2 md:w-full w-80 overflow-x-auto">
        {Object.entries(DISH_CATEGORIES).map(([value, label]) => {
          return (
            <Chip
              key={value}
              checked={categories[value as KeyType]}
              onChange={() =>
                setCategories((state) => ({
                  ...categories,
                  [value]: !state[value as KeyType],
                }))
              }
            >
              {label}
            </Chip>
          );
        })}
      </div>
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        className="md:w-full w-80"
      >
        <Tabs.List>
          {data?.map((menu) => {
            return (
              <Tabs.Tab key={menu.id} value={menu.name}>
                {menu.name}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {data?.map((menu) => {
          return (
            <Tabs.Panel key={menu.id} value={menu.name} pt="xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 pb-2">
                {menu.dishes
                  .filter((dish) => categories[dish.category])
                  .filter((dish) => {
                    const lwrQuery = searchQuery.toLowerCase();

                    return (
                      dish.name.toLowerCase().includes(lwrQuery) ||
                      dish.description.toLowerCase().includes(lwrQuery) ||
                      DISH_CATEGORIES[dish.category]
                        .toLowerCase()
                        .includes(lwrQuery)
                    );
                  })
                  .map((dish) => {
                    return (
                      <DishCard key={dish.id} dish={dish} menuId={menu.id} />
                    );
                  })}
              </div>
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Menu;
