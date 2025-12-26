import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './code-text.module.scss';

export interface CodeTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'gradient';
}

export const CodeText = ({ children, variant = 'default', className, ...props }: CodeTextProps) => (
  <div className={cn(styles.codeText, styles[`codeText-${variant}`], className)} {...props}>
    {children}
  </div>
);
