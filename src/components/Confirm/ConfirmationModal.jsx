const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
                <h3 className="text-2xl font-semibold mb-2">Xác nhận</h3>
                <p className="text-xl mb-3">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={onConfirm}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
