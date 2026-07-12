import Image from 'next/image';
import { cn } from '@/lib/utils';

const APP_ICON = '/brand/app-icon.png';

type AppLogoProps = {
  size?: number;
  showName?: boolean;
  label?: string;
  className?: string;
  nameClassName?: string;
};

export function AppLogo({
  size = 32,
  showName = true,
  label = 'Madsjeez Seller Browser',
  className,
  nameClassName,
}: AppLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src={APP_ICON}
        alt=""
        width={size}
        height={size}
        className="rounded-lg"
        aria-hidden
        priority
      />
      {showName && (
        <span
          className={cn(
            'font-display text-sm font-semibold text-foreground',
            nameClassName,
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
