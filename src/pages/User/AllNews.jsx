import React, { useEffect, useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { axiosClient } from '~/api/apiRequest';
import formatDate from '~/utils/formatDate.jsx';
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
        <div className="max-w-[1110px] mx-auto min-h-screen bg-white mt-28">
            {/* Header Navigation */}
            <div className="container mx-auto">
                <div className="flex items-center h-16 space-x-8">
                    <h1 className="text-blue-900 font-bold text-4xl">TIN TỨC Y KHOA</h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto pt-8">
                {/* hàng 1 */}
                <div className="flex justify-center gap-8">
                    {/* khung lớn */}
                    {posts[0] && (
                        <div className="w-[90%]">
                            <NavLink
                                to={`/tin-tuc/${formatTitleForUrl(posts[0].title)}-${posts[0].postId}`}
                                className="cursor-pointer"
                            >
                                <div className="w-full h-[374px] max-h-[374px]">
                                    <img
                                        src={`${IMAGE_URL}${posts[0].image}`}
                                        alt={posts[0].title}
                                        className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-12 flex flex-col gap-4">
                                    <h2 className="text-5xl font-bold">{posts[0].title}</h2>
                                    <p
                                        className="line-clamp-3 overflow-hidden text-ellipsis"
                                        dangerouslySetInnerHTML={{ __html: posts[0].content }}
                                    ></p>

                                    <span className="flex items-center font-semibold gap-2">
                                        <MdOutlineDateRange />
                                        <span>{formatDate(posts[0].updateAt)}</span>
                                        <span> - </span>
                                        <span>{posts[0].userId.fullname}</span>
                                    </span>
                                </div>
                                <button className="flex items-center text-3xl mt-4 font-semibold text-blue-500">
                                    Xem tiếp
                                    <FaArrowRightLong className="ml-2" />
                                </button>
                            </NavLink>
                        </div>
                    )}

                    {/* 5 khung nhỏ */}
                    <div className="flex flex-col gap-4">
                        {posts.slice(1, 6).map((post) => (
                            <div key={post.postId} className="pb-4 mb-4">
                                <NavLink
                                    to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                                    className="cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        <div className="min-w-[160px] min-h-[100px]">
                                            <img
                                                src={`${IMAGE_URL}${post.image}`}
                                                alt={post.title}
                                                className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-2xl"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 font-semibold">
                                            <h3>{post.title}</h3>
                                            <p className="flex items-center text-xl gap-2">
                                                <MdOutlineDateRange />
                                                <span>{formatDate(post.updateAt)}</span>
                                                <span>-</span>
                                                <span>{post.userId.fullname}</span>
                                            </p>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>

                {/* hàng 2 */}
                <div className="flex flex-wrap px-6 gap-24 mt-20">
                    {posts.slice(6).map((post) => (
                        <div key={post.postId} className="max-w-lg pb-4 mb-4">
                            <NavLink
                                to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                                className="cursor-pointer"
                            >
                                {console.log('postId', post.postId)}
                                <div className="flex flex-col gap-4">
                                    <div className="w-[320px] h-[200px] overflow-hidden">
                                        <img
                                            src={`${IMAGE_URL}${post.image}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover rounded-2xl"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <h3 className="text-3xl font-bold">{post.title}</h3>
                                        <p
                                            className="line-clamp-2 overflow-hidden text-ellipsis"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        ></p>
                                        <p className="flex items-center text-xl gap-2">
                                            <MdOutlineDateRange />
                                            <span>{formatDate(post.updateAt)}</span>
                                            <span> - </span>
                                            <span>{post.userId.fullname}</span>
                                        </p>
                                    </div>
                                    <button className="flex items-center font-semibold text-blue-500">
                                        Xem tiếp
                                        <FaArrowRightLong className="ml-2" />
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
