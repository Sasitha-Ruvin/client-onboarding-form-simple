import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-400',
          'dark:focus:ring-blue-400',
          error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 