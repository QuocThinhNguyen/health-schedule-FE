import { forwardRef } from 'react';

function Input({ id = null, label, type = 'text', placeholder = '', error, className = '', readOnly, ...props }, ref) {
    const readOnlyClass = readOnly ? 'bg-[var(--bg-secondary)] cursor-default' : '';
    return (
        <div className={`w-full mt-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                    {label}
                </label>
            )}
            <input
                id={id}
                ref={ref}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                className={`w-full px-3 py-2 h-10 border rounded focus:outline-none focus:ring-2 bg-[var(--bg-primary)] ${
                    error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--border-primary)] focus:ring-blue-500'
                } ${readOnlyClass}`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default forwardRef(Input);
