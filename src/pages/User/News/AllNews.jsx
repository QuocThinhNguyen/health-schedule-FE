import { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import {formatDate} from '~/utils/formatDate.jsx';
import Pagination from '~/components/Pagination';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function AllNews() {
    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;
    const [posts, setPosts] = useState([]);

    const [pagination, setPagination] = useState({ page: 1, limit: 15, totalPages: 1 });

    useEffect(() => {
        getAllPostsAndFilter();
    }, [pagination.page]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            page: page, // Cập nhật thuộc tính page
        }));
    };

    const getAllPostsAndFilter = async () => {
        try {
            const response = await axiosClient.get(`/post?page=${pagination.page}&&limit=${pagination.limit}`);
            if (response.status === 200) {
                setPosts(response.data);
                console.log('Posts:', response.data);
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
                console.error('No posts are found:', response.message);
                setPosts([]);
            }
        } catch (error) {
            console.error('Failed to get posts:', error);
            setPosts([]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen bg-white">
            <div className="container mx-auto">
                <div className="flex items-center h-16 space-x-8">
                    <h1 className="text-[#003553] font-bold text-3xl px-4 pt-6 pb-4">TIN TỨC Y KHOA</h1>
                </div>
            </div>

            <main className="container">
                <div className="flex justify-center">
                    <div className="w-[62.5%]">
                        {posts[0] && (
                            <div className="px-1 group">
                                <NavLink
                                    to={`/tin-tuc/${formatTitleForUrl(posts[0].title)}-${posts[0].postId}`}
                                    className="cursor-pointer p-3 border border-transparent group-hover:boder group-hover:border-[#00B5F1] rounded-2xl group-hover:shadow-lg block"
                                >
                                    <div className="w-full h-[374px] max-h-[374px]">
                                        <img
                                            src={`${IMAGE_URL}${posts[0].image}`}
                                            alt={posts[0].title}
                                            className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="mt-6 flex flex-col">
                                        <h2 className="mb-2 text-3xl font-bold group-hover:text-[#00b5f1]">
                                            {posts[0].title}
                                        </h2>
                                        <p
                                            className="line-clamp-3 overflow-hidden text-ellipsis"
                                            dangerouslySetInnerHTML={{ __html: posts[0].content }}
                                        ></p>

                                        <span className="mt-1 flex items-center font-semibold gap-2">
                                            <MdOutlineDateRange />
                                            <span>{formatDate(posts[0].updateAt)}</span>
                                            {/* <span> - </span>
                                            <span>{posts[0].userId.fullname}</span> */}
                                        </span>
                                    </div>
                                    <button className="flex items-center text-xl mt-2 font-medium text-[#00B5F1]">
                                        Xem tiếp
                                        <FaArrowRightLong className="ml-2" />
                                    </button>
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <div className="w-[37.5%]">
                        <div className="px-1 flex flex-col gap-3">
                            {posts.slice(1, 6).map((post) => (
                                <div key={post.postId} className="pb-3 group">
                                    <NavLink
                                        to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                                        className="cursor-pointer p-3 border border-transparent group-hover:boder group-hover:border-[#00B5F1] rounded-2xl group-hover:shadow-lg block"
                                    >
                                        <div className="flex gap-4">
                                            <div className="min-w-[140px] min-h-[100px]">
                                                <img
                                                    src={`${IMAGE_URL}${post.image}`}
                                                    alt={post.title}
                                                    className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-start gap-2">
                                                <h3 className="group-hover:text-[#00b5f1] font-bold">{post.title}</h3>
                                                <p className="flex items-center text-sm gap-2 font-medium">
                                                    <MdOutlineDateRange />
                                                    <span>{formatDate(post.updateAt)}</span>
                                                    {/* <span>-</span>
                                                    <span>{post.userId.fullname}</span> */}
                                                </p>
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap mt-7">
                    {posts.slice(6).map((post) => (
                        <div key={post.postId} className=" p-1 w-1/3 group">
                            <NavLink
                                to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                                className="cursor-pointer p-3 border border-transparent group-hover:boder group-hover:border-[#00B5F1] rounded-2xl group-hover:shadow-lg block"
                            >
                                {console.log('postId', post.postId)}
                                <div className="flex flex-col">
                                    <div className="w-full h-48 overflow-hidden">
                                        <img
                                            src={`${IMAGE_URL}${post.image}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover rounded-2xl"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex flex-col mt-2">
                                        <h3 className="text-xl font-bold group-hover:text-[#00b5f1] line-clamp-2 overflow-hidden text-ellipsis">
                                            {post.title}
                                        </h3>
                                        <p
                                            className="mt-2 text-[#858585] line-clamp-2 overflow-hidden text-ellipsis"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        ></p>
                                        <p className="mt-2 flex items-center text-xs font-medium gap-2">
                                            <MdOutlineDateRange />
                                            <span>{formatDate(post.updateAt)}</span>
                                            {/* <span> - </span>
                                            <span>{post.userId.fullname}</span> */}
                                        </p>
                                    </div>
                                    <button className="mt-3 flex items-center font-medium text-blue-500">
                                        Xem tiếp
                                        <FaArrowRightLong className="ml-2 mt-1" />
                                    </button>
                                </div>
                            </NavLink>
                        </div>
                    ))}
                </div>
            </main>

            <div className="text-center">
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AllNews;
