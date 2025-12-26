import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-medical-700 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 rounded-lg border
            ${error ? 'border-danger-500 focus:ring-danger-500' : 'border-medical-300 focus:ring-primary-500'}
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-all duration-200
            placeholder:text-medical-400
            disabled:bg-medical-100 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-danger-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-medical-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
