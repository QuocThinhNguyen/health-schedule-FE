import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import Pagination from '~/components/Pagination';

function Review() {
    const [selectedReview, setSelectedReview] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [feedbacks, setFeedbacks] = useState([]);
    console.log('Feedbacks:', feedbacks);
    const { user } = useContext(UserContext);

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
                console.log('Feedbacksssssss:', response);
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
        <main className="flex-1">
            {/* Reviews Content */}
            <div className="bg-white rounded-xl shadow-sm px-6 pt-3 pb-1">
                {/* Reviews List */}
                <div className=" bg-white">
                    {/* Reviews List */}
                    <div className="space-y-6">
                        {feedbacks?.data &&
                            feedbacks.data.map((feedback) => (
                                <div key={feedback.id} className="border-b pb-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                {feedback.patientId.fullname[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <strong className="font-bold text-lg">
                                                    {feedback.patientId.fullname}
                                                </strong>
                                                <span className="text-gray-400 text-base">
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
                                                        className={`w-4 h-4 mt-2 ${
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
                                </div>
                            ))}
                    </div>
                </div>
                <div className="text-center">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </main>
    );
}

export default Review;
