import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './code-text.module.scss';

export interface CodeTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gradient';
}

export const CodeText = forwardRef<HTMLDivElement, CodeTextProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.codeText, styles[`codeText-${variant}`], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CodeText.displayName = 'CodeText';

