import { Title } from '@mantine/core';
import UserMenu from './UserMenu';
import { IconPaperBag } from '@tabler/icons-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex items-center w-full px-8 py-4 justify-between border-0 border-b border-slate-200 border-solid">
      <Link
        href="/"
        className="text-black hover:no-underline flex items-center gap-4"
      >
        <IconPaperBag size={42} className="text-red-400 w-8" />
        <Title order={1} className="text-2xl hidden sm:block">
          Ebi Pocket
        </Title>
      </Link>
      <div>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
