import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import { toast } from 'react-toastify';
import { axiosClient, axiosInstance } from '~/api/apiRequest';
import { Plus, Edit, Trash, MessageCircle, Send, Play, Video } from 'lucide-react';

function DoctorVideoManagement() {
    return (
        <div className="p-6 w-150 h-full border rounded-lg shadow-lg bg-white overflow-y-auto">
            <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">Danh sách Video</div>
                <button className="border rounded-lg px-4 py-2 justify-center items-center flex gap-2 bg-blue-400 hover:bg-blue-500">
                    <img src="/video-posting.png" alt="video-posting" className="w-5 h-5" />
                    <span className="text-white">Thêm Video</span>
                </button>
            </div>
            <div className="mt-10">
                <div className="border rounded-lg w-fit">
                    <div>
                        <video src="/video.mp4" controls className="w-full h-60" />
                    </div>
                    <div className="p-2 space-y-2">
                        <div className="text-lg font-medium">Dấu hiệu bệnh tiểu đường</div>
                        <div>
                            <div className="flex items-center justify-start gap-8">
                                <Edit size={20} />
                                <Trash size={20} />
                                <MessageCircle size={20} />
                                <button className="flex items-center justify-end ml-auto">
                                    <Play size={20} />
                                    <span>100</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorVideoManagement;
