import React from 'react';
import PropTypes from 'prop-types';
import renderStars from '~/pages/Home/ListClinic/renderStars';

const Table = ({ columns, data, pagination, actions }) => {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const getValueFromKey = (key, item) => {
        if (typeof key !== 'string') {
            console.error('Expected key to be a string, but got:', typeof key);
            return null;
        }
        return key.split('.').reduce((acc, part) => acc?.[part] ?? null, item);
    };
    const renderCell = (column, item) => {
        const value = getValueFromKey(column.key, item);
        const src = `${IMAGE_URL}${value}`;

        switch (column.type) {
            case 'image':
                return <img src={src} alt="Image" className="w-8 h-8 rounded-full object-cover" />;

            case 'avatar':
                return (
                    <img
                        src={src}
                        alt="Avatar"
                        className="w-10 h-10 rounded-md border-2 border-blue-500 object-cover"
                    />
                );

            case 'timeTypes':
                return Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-1">
                        {value.map((timeType, index) => (
                            <span
                                key={index}
                                className="bg-[rgba(var(--bg-active-rgb),0.15)] text-[rgb(var(--bg-active-rgb))] px-2 py-1 rounded border border-[var(--border-primary)] text-sm"
                            >
                                {timeType || 'Null'}
                            </span>
                        ))}
                    </div>
                ) : null;

            case 'rating':
                return (
                    <div className="flex items-center  leading-[18px] text-customYellow font-normal">
                        {renderStars(value)}
                    </div>
                );

            default:
                return value || 'Null';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="border border-[var(--border-primary)] text-[var(--text-primary)]">
                        <th className="px-3 py-3 font-semibold whitespace-nowrap text-center">#</th>
                        {columns.map((column) => (
                            <th key={column.key} className="px-3 py-3 font-semibold whitespace-nowrap text-left">
                                {column.label}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-3 py-3 font-semibold whitespace-nowrap text-center">Hành động</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item._id} className="border border-[var(--border-primary)]">
                            <td className="px-3 py-2 text-center">
                                {index + 1 + pagination.limit * (pagination.page - 1)}
                            </td>
                            {columns.map((column) => (
                                <td key={column.key} className="px-3 py-2 min-w-28 max-w-64">
                                    {renderCell(column, item)}
                                </td>
                            ))}
                            {actions && (
                                <td className="py-2">
                                    <div className="flex items-center justify-center">
                                        {actions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => action.onClick(item)}
                                                className="mx-2 p-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)]  rounded text-lg hover:text-blue-800"
                                            >
                                                {action.icon}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    actions: PropTypes.array,
};

export default Table;
