import React, { useState, useEffect, useContext } from 'react';
import { FaCamera } from 'react-icons/fa';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import {
    BarChart3,
    Calendar,
    Users,
    FileText,
    Star,
    UserCircle,
    CreditCard,
    Settings,
    Bell,
    ChevronDown,
    Search,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
} from 'lucide-react';

function Review() {
    const [selectedReview, setSelectedReview] = useState(null);

    const reviews = [
        {
            id: 1,
            patientName: 'Nguyễn Văn A',
            rating: 5,
            date: '15/05/2023',
            comment: 'Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với dịch vụ.',
            response: null,
        },
        {
            id: 2,
            patientName: 'Trần Thị B',
            rating: 4,
            date: '20/05/2023',
            comment: 'Dịch vụ tốt, nhưng thời gian chờ đợi hơi lâu.',
            response: 'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cải thiện thời gian chờ đợi trong thời gian tới.',
        },
        {
            id: 3,
            patientName: 'Lê Văn C',
            rating: 3,
            date: '10/05/2023',
            comment: 'Bác sĩ giỏi nhưng thái độ hơi cộc cằn.',
            response: null,
        },
        {
            id: 4,
            patientName: 'Phạm Thị D',
            rating: 5,
            date: '18/05/2023',
            comment: 'Rất hài lòng với cách bác sĩ giải thích về tình trạng bệnh của tôi.',
            response: null,
        },
        {
            id: 5,
            patientName: 'Hoàng Văn E',
            rating: 4,
            date: '12/05/2023',
            comment: 'Phòng khám sạch sẽ, nhân viên thân thiện.',
            response: null,
        },
    ];

    const overallRating = 4.2;
    const totalReviews = reviews.length;
    const ratingDistribution = {
        5: 60,
        4: 30,
        3: 5,
        2: 3,
        1: 2,
    };
    return (
        <main className="flex-1">
            {/* Reviews Content */}
            <div className="p-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    {/* Overall Rating */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold">{overallRating.toFixed(1)}</h2>
                            <div className="flex items-center mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < Math.round(overallRating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-500">{totalReviews} đánh giá</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(ratingDistribution)
                                .reverse()
                                .map(([rating, percentage]) => (
                                    <div key={rating} className="flex items-center">
                                        <span className="w-3">{rating}</span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-current ml-1" />
                                        <div className="w-48 h-2 bg-gray-200 rounded-full ml-2">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500">{percentage}%</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{review.patientName}</h3>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-1 text-gray-400 hover:text-gray-600">
                                            <ThumbsUp className="w-5 h-5" />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-600">
                                            <ThumbsDown className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-600">{review.comment}</p>
                                {review.response && (
                                    <div className="mt-4 pl-4 border-l-4 border-blue-500">
                                        <p className="text-sm font-semibold">Phản hồi của bác sĩ:</p>
                                        <p className="mt-1 text-sm text-gray-600">{review.response}</p>
                                    </div>
                                )}
                                {!review.response && (
                                    <button
                                        onClick={() => setSelectedReview(review)}
                                        className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Phản hồi
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-8">
                        <p className="text-sm text-gray-500">Hiển thị 1-5 trong tổng số 20 đánh giá</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border rounded-md">Trước</button>
                            <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md">1</button>
                            <button className="px-3 py-1 text-sm border rounded-md">2</button>
                            <button className="px-3 py-1 text-sm border rounded-md">3</button>
                            <button className="px-3 py-1 text-sm border rounded-md">Sau</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response Modal */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Phản hồi đánh giá</h2>
                        <p className="text-gray-600 mb-4">{selectedReview.comment}</p>
                        <textarea
                            className="w-full h-32 p-2 border rounded-md mb-4"
                            placeholder="Nhập phản hồi của bạn..."
                        ></textarea>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Gửi phản hồi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Review;
