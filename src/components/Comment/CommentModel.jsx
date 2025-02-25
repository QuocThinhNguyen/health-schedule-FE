import React, { useState, useEffect, useContext, useRef } from 'react';
import { Eye, X, Star, ArrowLeft } from 'lucide-react';
import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '~/api/apiRequest';
import { toast } from 'react-toastify';
const CommentModel = () => {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [showGuide, setShowGuide] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log('TESSSST', state);
    const [doctorInfo, setDoctorInfo] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    // console.log('Media files:', mediaFiles);
    // console.log('Previews:', previews);

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await axiosInstance.get(`/doctor/${state.doctorId}`);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch doctor info: ', error.message);
            }
        };
        fetchDoctorInfo();
    }, []);

    const handleBack = () => {
        navigate('/user/appointments');
    };
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!state?.patientRecordId || !state?.doctorId) {
    //         toast.error('Thiếu thông tin bệnh nhân hoặc bác sĩ!');
    //         return;
    //     }

    //     const feedbackData = {
    //         patientId: state.patientRecordId,
    //         doctorId: state.doctorId,
    //         rating,
    //         comment: review,
    //         date: state.appointmentDate,
    //         clinicId: state.clinicId,
    //     };

    //     console.log('Feedback data:', feedbackData);
    //     try {
    //         setIsSubmitting(true);
    //         const response = await axiosInstance.post('/feedback', feedbackData);
    //         if (response.status === 200) {
    //             toast.success('Đánh giá đã được gửi thành công!');
    //             navigate('/user/appointments'); // Điều hướng về trang quản lý lịch hẹn
    //         } else {
    //             toast.error('Đánh giá không thành công, vui lòng thử lại.');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting feedback:', error);
    //         toast.error('Đã xảy ra lỗi khi gửi đánh giá.');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state?.patientRecordId || !state?.doctorId) {
            toast.error('Thiếu thông tin bệnh nhân hoặc bác sĩ!');
            return;
        }

        const formData = new FormData();
        formData.append('patientId', state.patientRecordId);
        formData.append('doctorId', state.doctorId);
        formData.append('rating', rating);
        formData.append('comment', review);
        formData.append('date', state.appointmentDate);
        formData.append('clinicId', state.clinicId);

        // Thêm file ảnh/video
        mediaFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            console.log('11');
            setIsSubmitting(true);
            const response = await axiosInstance.post('/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response check:', response);
            if (response.status === 200) {
                toast.success('Đánh giá đã được gửi thành công!');
                navigate('/user/appointments');
            } else {
                toast.error('Đánh giá không thành công, vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Đã xảy ra lỗi khi gửi đánh giá.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'));

        setMediaFiles((prev) => [...prev, ...validFiles]);

        // Create preview URLs
        validFiles.forEach((file) => {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => [...prev, url]);
        });
    };

    const handleViewImage = (file) => {
        const imageUrl = URL.createObjectURL(file);
        window.open(imageUrl, '_blank');
    };

    const handleRemoveImage = (index) => {
        setMediaFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    return (
        <div className="max-w-6xl mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-6 text-left">Đánh Giá Bác Sĩ</h1>

            {/* Product Info */}
            <div className="flex gap-4 mb-6 mt-12">
                <img
                    src={`${IMAGE_URL}${doctorInfo.image}`}
                    alt="Product"
                    className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                    <div className="font-medium text-lg">
                        {doctorInfo.position} {doctorInfo.fullname}
                    </div>
                    <div className="text-base">{doctorInfo.clinicName}</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating Section */}
                <div>
                    <div className="font-medium mb-2">Chất lượng dịch vụ</div>
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 ${
                                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating === 5 && <div className="text-yellow-500 font-medium">Tuyệt vời</div>}
                    {rating === 4 && <div className="text-yellow-500 font-medium">Hài lòng</div>}
                    {rating === 3 && <div className="text-yellow-500 font-medium">Bình thường</div>}
                    {rating === 2 && <div className="text-yellow-500 font-medium">Không hài lòng</div>}
                    {rating === 1 && <div className="text-yellow-500 font-medium">Tệ</div>}
                </div>

                {/* Review Text Area */}
                <div>
                    <label className="font-medium block">Trải nghiệm khám bệnh:</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Hãy chia sẻ những trải nghiệm của bạn về dịch vụ khám bệnh với bác sĩ này để giúp những bệnh nhân khác nhé."
                        className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mt-2"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        className="border rounded-lg px-4 py-2 flex items-center gap-2 bg-white hover:bg-gray-50"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <img src="/camera.png" alt="camera" className="w-5 h-5" />
                        Thêm ảnh
                    </button>
                    <button
                        type="button"
                        className="border rounded-lg px-4 py-2 flex items-center gap-2 bg-white hover:bg-gray-50"
                        onClick={() => videoInputRef.current?.click()}
                    >
                        <img src="/video.png" alt="camera" className="w-5 h-5" />
                        Thêm video
                    </button>
                    <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleFileSelect}
                        accept="video/*"
                        multiple
                        className="hidden"
                    />
                </div>

                <div className="mt-1 flex flex-wrap gap-4">
                    {mediaFiles.map((file, index) => (
                        <div key={index} className="relative group w-24 h-24 border rounded-lg overflow-hidden">
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                            )}

                            {/* Eye Icon (Zoom) */}
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => handleViewImage(file)}
                            >
                                <Eye className="mr-2 text-white" />
                            </div>

                            {/* Remove Icon (X) */}
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity "
                            >
                                <X className="mr-2 text-red-600 font-bold  hover:text-red-800" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        onClick={() => handleBack()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        TRỞ LẠI
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-red-500 text-white rounded-lg ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                        }`}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Hoàn Thành'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentModel;
