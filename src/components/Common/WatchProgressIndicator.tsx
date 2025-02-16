import { EyeIcon } from '@heroicons/react/24/solid';

interface WatchProgressIndicatorProps {
  watchProgress?: number;
  height?: number;
  badgeAbsolute?: boolean;
}

const WatchProgressIndicator = ({
  watchProgress = 0,
  height = 4,
  badgeAbsolute = true,
}: WatchProgressIndicatorProps) => {
  if (watchProgress === 1) {
    return (
      <div
        className={
          badgeAbsolute
            ? 'absolute right-0 bottom-0 flex items-end justify-between p-2'
            : 'flex items-end justify-between'
        }
      >
        <div className="pointer-events-none z-40 flex flex-col items-center gap-1">
          <div className="w-6 rounded-full bg-indigo-500 p-1 text-indigo-100 shadow-md">
            <EyeIcon />
          </div>
        </div>
      </div>
    );
  }

  if (watchProgress !== 0) {
    return (
      <div className="duration-400 absolute bottom-0 left-0 z-50 !mx-0 w-full">
        <div
          className="bg-indigo-500"
          style={{ height: `${height}px`, width: `${watchProgress * 100}%` }}
        />
      </div>
    );
  }

  return <div />;
};

export default WatchProgressIndicator;
