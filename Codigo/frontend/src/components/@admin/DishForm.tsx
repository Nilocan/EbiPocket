import {
  Button,
  FileInput,
  Image,
  NumberInput,
  Select,
  TextInput,
  Textarea,
} from '@mantine/core';
import {
  IconAlphabetLatin,
  IconCategory,
  IconCurrencyDollar,
  IconInfoCircle,
  IconPhone,
  IconPhoto,
  IconSoup,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authedClient } from '~/utils/api';

type DishCategory = 'appetizer' | 'toShare' | 'mainDish' | 'dessert';

export const DISH_CATEGORIES = {
  appetizer: 'Entrada',
  toShare: 'Para compartilhar',
  mainDish: 'Prato principal',
  dessert: 'Sobremesa',
};

export const categories: { label: string; value: DishCategory }[] = [
  { label: 'Entrada', value: 'appetizer' },
  { label: 'Para compartilhar', value: 'toShare' },
  { label: 'Prato principal', value: 'mainDish' },
  { label: 'Sobremesa', value: 'dessert' },
];

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: DishCategory;
}

export interface DishData extends Dish {
  file: string;
}

interface CreateDish extends Dish {
  file: File | null;
}

interface Props {
  dish?: DishData;
  cancel: () => void;
}

const DishForm: React.FC<Props> = ({ dish, cancel }) => {
  const [formFields, setFormFields] = useState<CreateDish | DishData>(
    dish ?? ({} as CreateDish),
  );

  const getFormData = () => {
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) =>
      formData.append(key, value),
    );

    return formData;
  };

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.post('/dish', getFormData());

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      cancel();
    },
  });
  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await authedClient.put(`/dish/${dish?.id}`, getFormData());

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      cancel();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormFields((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dish) createMutation.mutate();
    else updateMutation.mutate();
  };

  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Nome"
          name="name"
          icon={<IconAlphabetLatin />}
          radius="md"
          required
          onChange={handleChange}
          value={formFields.name}
        />
        <Textarea
          label="Descrição"
          name="description"
          icon={<IconInfoCircle />}
          radius="md"
          required
          onChange={handleChange}
          value={formFields.description}
        />
        <Select
          label="Categoria"
          icon={<IconCategory />}
          data={categories}
          required
          onChange={(value) =>
            setFormFields((state) => ({
              ...state,
              category: value as DishCategory,
            }))
          }
          value={formFields.category}
        />
        <NumberInput
          label="Preço"
          icon={<IconCurrencyDollar />}
          min={0.01}
          precision={2}
          step={0.01}
          required
          onChange={(value) =>
            setFormFields((state) => ({
              ...state,
              price: value || 10.0,
            }))
          }
          value={formFields.price}
        />
        <FileInput
          label="Imagem"
          icon={
            !formFields.file ? (
              <IconPhoto />
            ) : (
              <Image
                src={
                  typeof formFields.file === 'string'
                    ? formFields.file
                    : URL.createObjectURL(formFields.file)
                }
                alt="Foto do prato"
                radius="sm"
                m={5}
              />
            )
          }
          onChange={(file) => {
            setFormFields((state) => ({ ...state, file }));
          }}
          value={typeof formFields.file === 'string' ? null : formFields.file}
          placeholder={
            typeof formFields.file === 'string' ? 'Imagem atual' : ''
          }
          accept="image/png,image/jpeg"
          clearable={false}
          required
        />
        <Button radius="md" type="submit">
          {!dish ? 'Cadastrar' : 'Salvar'}
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

export default DishForm;
