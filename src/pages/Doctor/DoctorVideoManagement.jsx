import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { Plus, Edit, Trash, MessageCircle, Send, Play, Heart, X } from 'lucide-react';
import e from 'cors';
import { set } from 'date-fns';
import Pagination from '~/components/Pagination';
import { useNavigate } from 'react-router-dom';
import VideoItem from '~/components/Video/VideoItem';

function DoctorVideoManagement() {
    const { user } = useContext(UserContext);
    const [addVideo, setAddVideo] = useState(false);
    const [editVideo, setEditVideo] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState({});
    const [title, setTitle] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [nameVideo, setNameVideo] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const videoInputRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [pagination, setPagination] = useState({ page: 1, limit: 15, totalPages: 1 });
    const [detailVideo, setDetailVideo] = useState({});
    const [comfirmDelete, setComfirmDelete] = useState(false);
    const [idDelete, setIdDelete] = useState(null);
    const closeModal = () => {
        setAddVideo(false);
        setEditVideo(false);
        setShowComment(false);
    };

    // lấy ngày hiện tại
    const currentDate = new Date().toISOString().slice(0, 10);
    const doctorId = user.userId;

    const openAddVideo = () => {
        setAddVideo(true);
        setTitle('');
        setVideoUrl('');
        setNameVideo('');
        setVideoFile(null);
    };
    const handleAddVideo = async () => {
        // const data = {
        //     title,
        //     specialty,
        //     nameVideo,
        //     doctorId,
        //     currentDate,
        // };
        // console.log('get data: ', data);

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', title);
        formData.append('specialty', specialty);
        formData.append('doctorId', doctorId);
        formData.append('currentDate', currentDate);

        try {
            const response = await axiosInstance.post('/video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                toast.success('Thêm video thành công');
                closeModal();
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error('Thêm video thất bại');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const videoURL = URL.createObjectURL(file);
            setVideoFile(file);
            setNameVideo(file.name);
            setVideoUrl(videoURL);
        }
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            page: page, // Cập nhật thuộc tính page
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/doctor/${user.userId}?page=${pagination.page}&&limit=${pagination.limit}`,
                );
                console.log('response', response);
                if (response.status === 200) {
                    setDoctorInfo(response.data);
                    setSpecialty(response.data.specialtyId);
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setDoctorInfo({});
            }
        };
        fetchData();
    }, []);

    // console.log('data video', videos);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/video/${user.userId}?page=${pagination.page}&limit=${pagination.limit}`,
                );
                // console.log('response check', response);
                if (response.status === 200) {
                    setVideos(response.data);
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
                console.error('Error fetching video data:', error);
            }
        };
        fetchData();
    }, [pagination.page]);

    const getDetailVideo = async (videoId) => {
        try {
            const response = await axiosInstance.get(`/video/detail/${videoId}`);
            console.log('Detail video:', response);
            if (response.status === 200) {
                setDetailVideo(response.data);
                setTitle(response.data.videoTitle);
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
        }
        setEditVideo(true);
        console.log('name', detailVideo.videoName);
    };

    const updateVideo = async (videoId) => {
        try {
            console.log('videoId', videoId);
            console.log('update', title);

            const response = await axiosInstance.put(`/video/${videoId}`, {
                videoTitle: title,
            });

            if (response.status === 200) {
                toast.success('Cập nhật video thành công');
                closeModal();
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error('Cập nhật video thất bại');
            }
        } catch (error) {
            console.error('Error update video data:', error);
        }
    };

    const handleCancelDelete = () => {
        setComfirmDelete(false);
        setTitle('');
        setIdDelete(null);
    };

    const deleteVideo = async (videoId) => {
        try {
            const response = await axiosInstance.get(`/video/detail/${videoId}`);
            console.log('Detail video:', response);
            if (response.status === 200) {
                setTitle(response.data.videoTitle);
                setIdDelete(response.data.videoId);
            }
        } catch (error) {
            console.error('Error delete video:', error);
        }
        setComfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/video/${idDelete}`);
            if (response.status === 200) {
                toast.success('Xóa video thành công');
                setComfirmDelete(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error('Xóa video thất bại');
            }
        } catch (error) {
            console.error('Error delete video:', error);
        }
    };

    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    const getVideo = (videoId) => {
        console.log('get videoId:', videoId);
        navigate(`/video?idVideo=${videoId}&&idDoctor=${user.userId}`);
    };

    return (
        <div className="p-6 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto">
            <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">Danh sách Video</div>
                <button className="border rounded-lg px-4 py-2 justify-center items-center flex gap-2 bg-blue-400 hover:bg-blue-500">
                    <img src="/video-posting.png" alt="video-posting" className="w-5 h-5" />
                    <span className="text-white" onClick={openAddVideo}>
                        Thêm Video
                    </span>
                </button>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                    {videos.map((video) => (
                        // <div className="border rounded-lg shadow-lg w-fit bg-[#f9f8fc]" key={video._id}>
                        //     <div className="w-full aspect-auto border rounded-md overflow-hidden">
                        //         <video
                        //             src={`${IMAGE_URL}${video.videoName}`}
                        //             className="w-full h-full object-cover"
                        //             controls
                        //         />
                        //     </div>
                        //     <div className="p-2 space-y-2">
                        //         <div className="text-base font-medium h-12 line-clamp-2">{video.videoTitle}</div>
                        //         <div className="flex items-center justify-between w-full">
                        //             {/* Action buttons group */}
                        //             <div className="flex items-center gap-4">
                        //                 <button
                        //                     className="text-blue-500 hover:text-blue-600"
                        //                     onClick={() => getDetailVideo(video.videoId)}
                        //                 >
                        //                     <Edit className="w-5 h-5" />
                        //                 </button>
                        //                 <button
                        //                     className="text-gray-500 hover:text-red-600"
                        //                     onClick={() => deleteVideo(video.videoId)}
                        //                 >
                        //                     <Trash className="w-5 h-5" />
                        //                 </button>
                        //                 <button
                        //                     className="text-green-500 hover:text-green-600"
                        //                     onClick={() => getVideo(video.videoId)}
                        //                 >
                        //                     <MessageCircle className="w-5 h-5" />
                        //                 </button>
                        //             </div>

                        //             {/* Stats group */}
                        //             <div className="flex items-center gap-4">
                        //                 <div className="flex items-center gap-1 text-red-500">
                        //                     <Heart className="w-5 h-5" />
                        //                     <span>{video.likes}</span>
                        //                 </div>
                        //                 <div className="flex items-center gap-1 text-yellow-500">
                        //                     <Play className="w-5 h-5" />
                        //                     <span>{video.views}</span>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                        <VideoItem key={video.videoId} data={video} />
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
            {addVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 w-3/5 h-fit">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">Thêm video mới</div>
                            <X
                                className="text-red-600 w-6 h-6 cursor-pointer hover:text-red-700"
                                onClick={closeModal}
                            />
                        </div>
                        <div className="flex w-full gap-6">
                            <div className="flex flex-col w-1/2 mt-4">
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Tiêu đề</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={title}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Chuyên khoa</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={doctorInfo.specialtyName}
                                        onChange={(e) => setSpecialty(doctorInfo.specialtyId)}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">File video</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                            value={nameVideo}
                                            required
                                        />
                                        <button
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                            onClick={() => videoInputRef.current?.click()}
                                        >
                                            <img src="/upload.png" alt="upload" className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            onChange={handleFileSelect}
                                            accept="video/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mt-4">
                                <label className="block text-lg font-medium text-gray-700">Xem trước Video</label>
                                <div className="w-full aspect-video border rounded-md overflow-hidden">
                                    {videoUrl ? (
                                        <video src={videoUrl} className="w-full h-full" controls />
                                    ) : (
                                        <p className="text-center text-gray-500">Chưa có video nào được chọn</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10 gap-8 pl-4">
                            <button className="border rounded-lg px-8 py-2 hover:bg-gray-200" onClick={closeModal}>
                                Hủy
                            </button>
                            <button
                                className="border rounded-lg px-8 py-2 bg-blue-400 text-white hover:bg-blue-500"
                                onClick={handleAddVideo}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 w-3/5 h-fit">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">Chỉnh sửa video</div>
                            <X
                                className="text-red-600 w-6 h-6 cursor-pointer hover:text-red-700"
                                onClick={closeModal}
                            />
                        </div>
                        <div className="flex w-full gap-6">
                            <div className="flex flex-col w-1/2 mt-4">
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Tiêu đề</label>
                                    <input
                                        type="text"
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={title}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Chuyên khoa</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={doctorInfo.specialtyName}
                                        onChange={(e) => setSpecialty(doctorInfo.specialtyId)}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">File video</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                            value={detailVideo.videoName}
                                            required
                                            readOnly
                                        />
                                        <button
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                            onClick={() => videoInputRef.current?.click()}
                                            disabled
                                        >
                                            <img src="/upload.png" alt="upload" className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={videoInputRef}
                                            onChange={handleFileSelect}
                                            accept="video/*"
                                            multiple
                                            className="hidden"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mt-4">
                                <label className="block text-lg font-medium text-gray-700">Xem trước Video</label>
                                <div className="w-full aspect-video border rounded-md overflow-hidden">
                                    {detailVideo ? (
                                        <video
                                            src={`${IMAGE_URL}${detailVideo.videoName}`}
                                            className="w-full h-full"
                                            controls
                                        />
                                    ) : (
                                        <p className="text-center text-gray-500">Chưa có video nào được chọn</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10 gap-8 pl-4">
                            <button className="border rounded-lg px-8 py-2 hover:bg-gray-200" onClick={closeModal}>
                                Hủy
                            </button>
                            <button
                                className="border rounded-lg px-8 py-2 bg-blue-400 text-white hover:bg-blue-500"
                                onClick={() => updateVideo(detailVideo.videoId)}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {comfirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        {/* Header */}
                        <div className="flex justify-end p-4">
                            <button
                                className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                onClick={handleCancelDelete}
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 text-center">
                            {/* Avatar with X icon */}
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                    <img src="/deleteVideo.png" alt="delete video" className="w-16 h-16" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold mb-4">Xóa video</h2>

                            {/* Message */}
                            <p className="text-gray-600 mb-8">
                                Bạn có chắc chắn muốn xóa video <span className="font-bold text-gray-900">{title}</span>{' '}
                                khỏi danh sách video của bạn không?
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    // onClick={onConfirm}
                                    className="flex-1 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    onClick={handleConfirmDelete}
                                >
                                    Đồng ý, xóa
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Không, giữ lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 w-3/5 h-fit">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">Quản lý video</div>
                            <X
                                className="text-red-600 w-6 h-6 cursor-pointer hover:text-red-700"
                                onClick={closeModal}
                            />
                        </div>
                        <div className="mt-4 space-y-4">
                            {comments.map((comment) => (
                                <div className="boder-b" key={comment.id}>
                                    <div className="space-y-2 border-b pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className="font-medium">{comment.user}</div>
                                                <div>{comment.content}</div>
                                            </div>
                                            <button className="items-center flex justify-center gap-2 text-red-500">
                                                <Heart className="w-5 h-5" />
                                                <span>{comment.likes}</span>
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="border px-4 py-1 w-full rounded-sm focus:outline-blue-300"
                                            />
                                            <button className="absolute top-1/2 right-3 transform -translate-y-1/2">
                                                <Send className="text-blue-500 w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorVideoManagement;
