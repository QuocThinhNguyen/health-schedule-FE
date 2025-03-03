import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { Plus, Edit, Trash, MessageCircle, Send, Play, Heart, X } from 'lucide-react';
import { set } from 'date-fns';
import { comment } from 'postcss';

function DoctorVideoManagement() {
    const [addVideo, setAddVideo] = useState(false);
    const [editVideo, setEditVideo] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comments, setComments] = useState([
        {
            id: 1,
            videoId: 1,
            user: 'Nguyễn Văn A',
            content: 'Video rất hữu ích, cảm ơn bác sĩ!',
            reply: '',
            likes: 0,
            isLiked: false,
        },
        {
            id: 2,
            videoId: 1,
            user: 'Trần Thị B',
            content: 'Tôi có thêm câu hỏi về cách điều trị, bác sĩ có thể giải thích thêm được không?',
            reply: '',
            likes: 2,
            isLiked: true,
        },
    ]);
    const closeModal = () => {
        setAddVideo(false);
        setEditVideo(false);
        setShowComment(false);
    };
    return (
        <div className="p-6 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto">
            <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">Danh sách Video</div>
                <button className="border rounded-lg px-4 py-2 justify-center items-center flex gap-2 bg-blue-400 hover:bg-blue-500">
                    <img src="/video-posting.png" alt="video-posting" className="w-5 h-5" />
                    <span className="text-white" onClick={() => setAddVideo(true)}>
                        Thêm Video
                    </span>
                </button>
            </div>
            <div className="mt-10">
                <div className="border rounded-lg shadow-lg w-fit bg-[#f9f8fc]">
                    <div>
                        <video src="/video.mp4" controls className="w-full h-60" />
                    </div>
                    <div className="p-2 space-y-2">
                        <div className="text-base font-medium">Dấu hiệu bệnh tiểu đường</div>
                        <div>
                            <div className="flex items-center justify-start gap-8">
                                <button
                                    className="text-blue-500 hover:text-blue-600"
                                    onClick={() => setEditVideo(true)}
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button className="text-gray-500 hover:text-red-600">
                                    <Trash className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-green-500 hover:text-green-600"
                                    onClick={() => setShowComment(true)}
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <div className="flex items-center justify-end ml-auto text-red-500 ">
                                    <Heart className="w-5 h-5" />
                                    <span>100</span>
                                </div>
                                <div className="flex items-center justify-end ml-auto text-yellow-500 ">
                                    <Play className="w-5 h-5" />
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={'bệnh ho'}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Chuyên khoa</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={'Hô hấp'}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Url video</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                            value={''}
                                            required
                                        />
                                        <button className="absolute top-1/2 right-3 transform -translate-y-1/2">
                                            <img src="/upload.png" alt="upload" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mt-4">
                                <label className="block text-lg font-medium text-gray-700">Xem trước Video</label>
                                <div className="w-full aspect-video border rounded-md overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="/video.mp4"
                                        title="Xem trước video"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10 gap-8 pl-4">
                            <button className="border rounded-lg px-8 py-2 hover:bg-gray-200" onClick={closeModal}>
                                Hủy
                            </button>
                            <button className="border rounded-lg px-8 py-2 bg-blue-400 text-white hover:bg-blue-500">
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
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={'bệnh ho'}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Chuyên khoa</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                        value={'Hô hấp'}
                                        required
                                    />
                                </div>
                                <div className="space-y-4 mt-4">
                                    <label className="font-semibold">Url video</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-4 py-2 border-gray-300 focus:outline-blue-500"
                                            value={''}
                                            required
                                        />
                                        <button className="absolute top-1/2 right-3 transform -translate-y-1/2">
                                            <img src="/upload.png" alt="upload" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/2 mt-4">
                                <label className="block text-lg font-medium text-gray-700">Xem trước Video</label>
                                <div className="w-full aspect-video border rounded-md overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="/video.mp4"
                                        title="Xem trước video"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10 gap-8 pl-4">
                            <button className="border rounded-lg px-8 py-2 hover:bg-gray-200" onClick={closeModal}>
                                Hủy
                            </button>
                            <button className="border rounded-lg px-8 py-2 bg-blue-400 text-white hover:bg-blue-500">
                                Lưu
                            </button>
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
