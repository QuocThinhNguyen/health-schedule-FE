import { AiOutlineEye, AiOutlineClockCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function VideoItem(data) {
    const navigate = useNavigate();
    const getDaysAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return '1 ngày trước';
        return `${diffDays} ngày trước`;
    };
    const getVideo = (videoId) => {
        navigate(`/video?idVideo=${videoId}&&idDoctor=${data.data.doctorId}`);
    };
    return (
        <div className="w-1/4 px-2 mt-4 group">
            <div
                className="bg-white rounded-lg shadow cursor-pointer border group-hover:border group-hover:border-[rgb(44,116,223)] group-hover:shadow-2xl"
                onClick={() => getVideo(data.data.videoId)}
            >
                <div className="max-w-full w-full h-72">
                    <video
                        src={data.data.videoName}
                        className="object-cover object-center w-full h-full rounded-tl-lg rounded-tr-lg"
                    />
                </div>
                <div className="px-3 pt-1 pb-3 space-y-2">
                    <h1 className="font-semibold text-base">{data.data.videoTitle}</h1>
                    <div className="flex items-center justify-start gap-3">
                        <img src={data.data.doctor.image} alt="image" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-semibold">{data.data.doctor.fullname}</p>
                            <p className="text-gray-500 text-sm">{data.data.specialty.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-1">
                            <AiOutlineEye className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500 text-sm">{data.data.views} lượt xem</span>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                            <AiOutlineClockCircle className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500 text-sm">{getDaysAgo(data.data.createAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoItem;
