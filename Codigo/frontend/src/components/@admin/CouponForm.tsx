import { Button, NumberInput, TextInput } from '@mantine/core';
import { CouponData } from '~/pages/admin/cupons';
import { useState } from 'react';
import {
  IconAlphabetLatin,
  IconCash,
  IconPercentage,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authedClient } from '~/utils/api';

interface Props {
  cancel: () => void;
}

const CouponForm: React.FC<Props> = ({ cancel }) => {
  const [formFields, setFormFields] = useState<CouponData>({} as CouponData);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (body: CouponData) => {
      const res = await authedClient.post('/coupon', body);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      cancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      name: formFields.name.toUpperCase(),
      discount: formFields.discount,
      minValue: formFields.minValue,
    };
    createMutation.mutate(body);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <TextInput
        label="Cupom"
        name="name"
        radius="md"
        required
        icon={<IconAlphabetLatin />}
        onChange={(e) =>
          setFormFields((state) => ({ ...state, name: e.target.value }))
        }
        value={formFields.name}
      />
      <NumberInput
        label="Desconto (%)"
        radius="md"
        required
        icon={<IconPercentage />}
        onChange={(value) =>
          setFormFields((state) => ({ ...state, discount: Number(value) }))
        }
        value={formFields.discount}
      />
      <NumberInput
        label="Valor mínimo"
        radius="md"
        required
        icon={<IconCash />}
        onChange={(value) =>
          setFormFields((state) => ({ ...state, minValue: Number(value) }))
        }
        value={formFields.minValue}
      />
      <Button radius="md" type="submit">
        Cadastrar
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
  );
};

export default CouponForm;
