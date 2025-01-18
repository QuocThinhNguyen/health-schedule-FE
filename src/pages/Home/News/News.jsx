import { ImNewspaper } from 'react-icons/im';
import NewsItem from './NewsItem';
import NewsItemMax from './NewsItemMax';
import { FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';

function News() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 5, totalPages: 1 });

    useEffect(() => {
        const getAllPostsAndFilter = async () => {
            try {
                const response = await axiosClient.get(`/post?page=${pagination.page}&&limit=${pagination.limit}`);
                if (response.status === 200) {
                    setPosts(response.data);
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
                } else {
                    toast.error('No posts are found:', response.message);
                    setPosts([]);
                }
            } catch (error) {
                toast.error('Failed to get posts:', error);
                setPosts([]);
            }
        };
        getAllPostsAndFilter();
    }, []);

    return (
        <div className=" bg-[#E3F2FF] py-8">
            <div className="max-w-6xl mx-auto px-4 py-2">
                <div className="flex items-center justify-between mb-2 text-[#2D87F3]">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ImNewspaper className="text-2xl font-bold" />
                        <span>Tin tức y tế</span>
                    </h2>
                    <p
                        onClick={() => navigate('/tin-tuc')}
                        className="text-sm font-semibold cursor-pointer hover:underline flex items-center gap-1"
                    >
                        <span>Xem tất cả</span>
                        <FaAngleRight className="mt-1" />
                    </p>
                </div>
                <div className="flex">
                    <div className="w-2/5">{posts[0] && <NewsItemMax data={posts[0]} />}</div>
                    <div className="w-3/5 flex items-center flex-wrap">
                        {posts.slice(1, 5).map((post, index) => (
                            <div key={index} className="w-1/2">
                                <NewsItem data={post} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default News;
