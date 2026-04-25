import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './code-text.module.scss';

export interface CodeTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CodeText = ({ children, className, ...props }: CodeTextProps) => (
  <div className={cn(styles.codeText, styles['codeText-gradient'], className)} {...props}>
    {children}
  </div>
);
