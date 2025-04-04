import Pagination from '../Pagination';

function AdvancePagination({ pagination, totalElements, onPageChange, selects, onSlectChange }) {
    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến {pagination.page * pagination.limit} trong
                số {totalElements} mục
            </div>
            <div className="text-right">
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                />
            </div>
            <div className="flex justify-end items-center gap-2">
                Hiển thị
                <select
                    className="pl-2 pr-4 py-1 rounded border bg-[var(--bg-primary)] border-[var(--border-primary)]"
                    name="number"
                    value={pagination.limit}
                    onChange={onSlectChange}
                >
                    {selects.map((select, index) => (
                        <option key={index} value={select}>
                            {select}
                        </option>
                    ))}
                </select>
                mục
            </div>
        </div>
    );
}

export default AdvancePagination;
