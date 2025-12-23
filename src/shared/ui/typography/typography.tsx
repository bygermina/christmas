import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './typography.module.scss';

type TypographyVariant = 'h1-hero' | 'subheading-responsive';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  className?: string;
  children: ReactNode;
}

const variantToTag: Record<TypographyVariant, ElementType> = {
  'h1-hero': 'h1',
  'subheading-responsive': 'p',
};

export const Typography = ({ variant, className, children, ...props }: TypographyProps) => {
  const Tag = variantToTag[variant];

  return (
    <Tag className={cn(styles[`typography-${variant}`], className)} {...props}>
      {children}
    </Tag>
  );
};
