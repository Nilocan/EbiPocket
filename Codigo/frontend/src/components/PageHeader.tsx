import { ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';

interface Props {
  children?: React.ReactNode;
  backTo?: string;
  hideBackButton?: boolean;
}

const PageHeader: React.FC<Props> = ({ children, backTo, hideBackButton }) => {
  const router = useRouter();

  return (
    <div
      className={`flex items-center relative w-full justify-center text-center ${
        !hideBackButton ? 'md:pl-12 pl-6' : ''
      }`}
    >
      {hideBackButton ? null : (
        <ActionIcon
          onClick={backTo ? () => router.push(backTo) : () => router.back()}
          variant="default"
          className="absolute left-0"
        >
          <IconArrowLeft />
        </ActionIcon>
      )}
      {children}
    </div>
  );
};

export default PageHeader;
