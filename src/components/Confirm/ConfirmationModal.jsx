const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--bg-primary)] rounded-md px-6 py-4 shadow-lg max-w-sm border border-[var(--border-primary)]">
                <h3 className="text-2xl font-semibold mb-2">Xác nhận</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="flex justify-center items-center gap-2 px-4 py-2 min-w-24 h-10 bg-[var(--bg-primary)] text-[var(--bg-active)] hover:bg-[#735dff26] dark:hover:bg-[#735dff26] transition-colors  rounded  border-2 border-[var(--bg-active)]"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="flex justify-center items-center gap-2 px-4 py-2 min-w-24 h-10 bg-[var(--bg-active)] text-[var(--text-active)] hover:bg-[rgba(var(--bg-active-rgb),0.9)] rounded border border-[var(--border-primary)]"
                        onClick={onConfirm}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
