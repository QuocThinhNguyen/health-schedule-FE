import React, { useState, useEffect, useContext } from 'react';
import { User, Calendar, Phone, Users, MapPin, Briefcase, Mail, IdCard, Plus } from 'lucide-react';
import { axiosInstance } from '~/api/apiRequest';
import { UserContext } from '~/context/UserContext';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoItem from '~/components/Video/VideoItem';

function VideoBookmark() {
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axiosInstance.get(`/bookmark/user/${user.userId}`);
                if (response.status === 200) {
                    setVideos(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu video:', error);
            }
        };
        fetchVideos();
    }, [user.userId]);

    console.log(videos);
    return (
        <div className="mt-20 fit overflow-y-auto">
            <div className="text-2xl text-black font-bold mb-1 text-start">Danh sách video</div>
            {videos.length === 0 ? (
                <div className="mt-5">Không có video nào</div>
            ) : (
                videos.map((video) => (
                    <div className="" key={video.date}>
                        <div className=" px-4 flex items-center justify-center">
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                            <span className="px-4 text-sm text-gray-500">{video.date}</span>
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                            {video.videos.map((item) => (
                                <VideoItem key={item.videoId} data={item} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default VideoBookmark;
