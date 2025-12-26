import { forwardRef, type ElementType } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './typography.module.scss';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'subheading' | 'body' | 'caption' | 'label';

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent';
  className?: string;
  children: React.ReactNode;
}

const variantToTag: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  subheading: 'p',
  body: 'p',
  caption: 'span',
  label: 'label',
};

export const Typography = forwardRef<
  HTMLElement,
  TypographyProps & React.HTMLAttributes<HTMLElement>
>(
  (
    {
      variant = 'body',
      color = 'default',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = variantToTag[variant] as ElementType;

    const classes = cn(
      styles.typography,
      styles[`typography-${variant}`],
      styles[`typography-color-${color}`],
      className,
    );

    return (
      <Tag ref={ref} className={classes} {...props}>
        {children}
      </Tag>
    );
  },
);

Typography.displayName = 'Typography';
