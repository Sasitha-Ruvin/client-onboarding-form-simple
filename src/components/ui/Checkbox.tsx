import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        <label
          htmlFor={props.id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 