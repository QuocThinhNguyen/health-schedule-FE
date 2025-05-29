import React, { forwardRef } from 'react';
import Select from 'react-select';

const SelectInput = (
    {
        id = null,
        label,
        options = [],
        placeholder = '',
        error,
        className = '',
        isClearable = true,
        isSearchable = true,
        readOnly = false,
        ...props
    },
    ref,
) => {
    // Nếu readOnly, vô hiệu hóa select
    const isDisabled = readOnly;

    return (
        <div className={`w-full mt-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                    {label}
                </label>
            )}
            <Select
                inputId={id}
                ref={ref}
                options={options}
                placeholder={placeholder}
                isClearable={isClearable}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                menuPortalTarget={document.body}
                className="z-50"
                classNames={{
                    control: () => `h-10 ${error ? 'border-red-500' : 'border-[var(--border-primary)]'}`,
                }}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: readOnly ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                        borderColor: error ? 'red' : '#E4E8EC',
                        boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : 'none',
                        '&:hover': {
                            borderColor: error ? 'red' : '#cbd5e1',
                        },
                        minHeight: '40px',
                        fontSize: '14px',
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                    }),
                }}
                {...props}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default forwardRef(SelectInput);
