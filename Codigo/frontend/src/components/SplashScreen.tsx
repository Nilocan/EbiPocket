import { IconPaperBag } from '@tabler/icons-react';

const SplashScreen = () => {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="flex items-center gap-4">
        <IconPaperBag size={50} className="text-red-400 animate-pulse" />
        <h1 className="animate-pulse text-4xl">Ebi Pocket</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
