import React from 'react';
import Select from 'react-select';

function SelectOption({
    options = [],
    value,
    onChange,
    placeholder = 'Chọn...',
    isClearable = false,    
    isSearchable = true,
    isMulti = false,
}) {
    const getSelectedOption = () => {
        if (isMulti && Array.isArray(value)) {
            return options.filter((opt) => value.includes(opt.value));
        } else {
            return options.find((opt) => opt.value === value) || null;
        }
    };

    const handleChange = (selectedOption) => {
        if (isMulti) {
            onChange(selectedOption ? selectedOption.map((opt) => opt.value) : []);
        } else {
            onChange(selectedOption ? selectedOption.value : '');
        }
    };

    return (
        <Select
            options={options}
            value={getSelectedOption()}
            onChange={handleChange}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            isMulti={isMulti}
            styles={{
                control: (provided) => ({
                    ...provided,
                    border: '0.8px solid var(--border-primary)',
                    borderRadius: '4px',
                    height: '40px',
                    backgroundColor: 'var(--bg-primary)',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: 'var(--text-color)',
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                menu: (provided) => ({
                    ...provided,
                    border: '0.8px solid var(--border-primary)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-color)',
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                        ? 'var(--bg-active)'
                        : state.isFocused
                        ? 'rgba(var(--bg-active-rgb),0.9)'
                        : 'var(--bg-primary)',
                    color: state.isSelected
                        ? 'var(--text-active)'
                        : state.isFocused
                        ? 'var(--text-active)'
                        : 'var(--text-color)',
                    cursor: 'pointer',
                }),
            }}
        />
    );
}

export default SelectOption;
