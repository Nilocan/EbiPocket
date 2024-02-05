import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Popover,
  Table,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CouponForm from '~/components/@admin/CouponForm';
import PageHeader from '~/components/PageHeader';
import { authedClient } from '~/utils/api';

export interface CouponData {
  name: string;
  discount: number;
  minValue: number;
}

const ManageCoupons = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data } = useQuery<CouponData[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await authedClient.get('/coupon');

      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await authedClient.delete(`/coupon/${name}`);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const handleDelete = (name: string) => {
    deleteMutation.mutate(name);
  };

  const handleClose = () => {
    close();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <PageHeader backTo="/admin">
        <Title order={1}>Gerenciar Cupons</Title>
      </PageHeader>
      <Button onClick={open}>Cadastrar</Button>
      <Modal opened={opened} onClose={handleClose} title="Cadastrar Cupom">
        <CouponForm cancel={handleClose} />
      </Modal>
      <div>
        <Table>
          <thead>
            <tr>
              <th>Cupom</th>
              <th>Desconto (%)</th>
              <th>Valor mínimo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((coupon) => {
              return (
                <tr key={coupon.name}>
                  <td>{coupon.name}</td>
                  <td>{coupon.discount}</td>
                  <td>{coupon.minValue}</td>
                  <td className="flex justify-center">
                    <Popover>
                      <Popover.Target>
                        <ActionIcon color="red">
                          <IconTrash />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Group>
                          <span>Tem certeza?</span>
                          <Button
                            compact
                            color="red"
                            variant="outline"
                            onClick={() => handleDelete(coupon.name)}
                          >
                            Sim
                          </Button>
                        </Group>
                      </Popover.Dropdown>
                    </Popover>
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

export default ManageCoupons;
