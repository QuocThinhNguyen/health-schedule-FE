import { useState, useEffect, useContext } from 'react';

import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Star } from 'lucide-react';
import Pagination from '~/components/Pagination';
import Modal from 'react-modal';

function Review() {
    const [pagination, setPagination] = useState({ page: 1, limit: 12, totalPages: 1 });
    const [feedbacks, setFeedbacks] = useState([]);
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const openModal = (media) => {
        setSelectedMedia(media);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedMedia(null);
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            page: page, // Cập nhật thuộc tính page
        }));
    };
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axiosInstance.get(
                    `/feedback/${user.userId}?page=${pagination.page}&&limit=${pagination.limit}`,
                );
                if (response.status === 200) {
                    setFeedbacks(response);
                    if (response.totalPages === 0) {
                        response.totalPages = 1;
                    }
                    if (pagination.totalPages !== response.totalPages) {
                        setPagination((prev) => ({
                            ...prev,
                            page: 1,
                            totalPages: response.totalPages,
                        }));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch feedbacks: ', error.message);
            }
        };
        fetchFeedbacks();
    }, [user.userId, pagination.page]);

    return (
        <div className="p-6 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto flex flex-col">
            <div className="text-xl font-semibold">Danh sách đánh giá</div>
            {/* Reviews List */}
            <div className="mt-4">
                {/* Reviews List */}
                <div className="space-y-6">
                    {feedbacks?.data && feedbacks.data.length > 0 ? (
                        feedbacks?.data &&
                        feedbacks.data.map((feedback) => (
                            <div key={feedback.id} className="border-b pb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            {feedback.patientId.fullname[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <strong className="font-bold text-base">
                                                {feedback.patientId.fullname}
                                            </strong>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(feedback.date).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                                disabled
                                            >
                                                <Star
                                                    className={`w-3 h-3 mt-2 ${
                                                        star <= feedback.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-base">{feedback.comment}</p>
                                <div>
                                    {/* Danh sách ảnh/video */}
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {feedback.mediaNames.map((mediaName, index) => (
                                            <div
                                                key={index}
                                                className="relative group w-12 h-12 border rounded-lg overflow-hidden cursor-pointer"
                                                onClick={() => openModal(mediaName)}
                                            >
                                                {mediaName.endsWith('.png') ||
                                                mediaName.endsWith('.jpg') ||
                                                mediaName.endsWith('.jpeg') ? (
                                                    <img
                                                        src={mediaName}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <video src={mediaName} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Modal hiển thị ảnh/video */}
                                    <Modal
                                        isOpen={isOpen}
                                        onRequestClose={closeModal}
                                        contentLabel="Media Preview"
                                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                        overlayClassName="fixed inset-0 bg-opacity-50 z-50"
                                    >
                                        <div className="relative max-w-2xl h-fit mt-20 p-4 bg-white rounded-lg">
                                            <button
                                                onClick={closeModal}
                                                className="absolute top-2 right-2 text-red-800 text-4xl font-bold"
                                            >
                                                &times;
                                            </button>
                                            {selectedMedia &&
                                            (selectedMedia.endsWith('.png') ||
                                                selectedMedia.endsWith('.jpg') ||
                                                selectedMedia.endsWith('.jpeg')) ? (
                                                <img
                                                    src={selectedMedia}
                                                    alt="Full View"
                                                    className="w-full h-auto max-h-[80vh] object-contain"
                                                />
                                            ) : (
                                                <video
                                                    src={selectedMedia}
                                                    controls
                                                    className="w-full max-h-[80vh] object-contain"
                                                />
                                            )}
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Chưa có đánh giá</p>
                    )}
                </div>
            </div>
            <div className="text-center mt-auto">
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default Review;
