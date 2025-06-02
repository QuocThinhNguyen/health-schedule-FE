import { MdOndemandVideo } from 'react-icons/md';
import VideoItem from './VideoItem';
import { axiosClient } from '~/api/apiRequest';
import { useEffect, useState, useContext } from 'react';

function ListVideo() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const getVideo = async () => {
            try {
                const response = await axiosClient.get(`video/top`);
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    console.log('Error:', response.message);
                }
            } catch (e) {
                console.log('Error:', e);
            }
        };
        getVideo();
    }, []);
    return (
        <div className=" bg-[#E0F8EE] py-8">
            <div className="max-w-6xl mx-auto px-4 py-2">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-[#2D87F3]">
                    <MdOndemandVideo className="text-2xl" />
                    <span>Video nổi bật</span>
                </h2>
                <div className="flex flex-wrap">
                    {data.slice(0, 8).map((video) => (
                        <VideoItem key={video._id} data={video} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListVideo;
