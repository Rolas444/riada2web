'use client';

import * as React from 'react';
import { clsx } from 'clsx';

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="file"
        className={clsx(
          'flex h-10 w-full items-center rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 ring-offset-white file:mr-4 file:border-0 file:bg-transparent file:py-2 file:px-0 file:text-sm file:font-medium file:text-blue-600 hover:file:cursor-pointer hover:file:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:ring-offset-gray-950 dark:file:text-blue-400 dark:hover:file:text-blue-300',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
FileInput.displayName = 'FileInput';

export { FileInput };

