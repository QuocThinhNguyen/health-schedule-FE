import {formatDate} from '~/utils/formatDate.jsx';
import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';
function NewsItemMax(data) {
    const post = data.data;

    const IMAGE_URL = `http://localhost:${import.meta.env.VITE_BE_PORT}/uploads/`;

    return (
        <div className="p-2 h-full group">
            <NavLink
                to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                className="cursor-pointer group-hover:shadow-xl p-3 block bg-white rounded-xl h-full"
            >
                <div className="w-full h-72 max-h-72">
                    <img
                        src={`${IMAGE_URL}${post.image}`}
                        alt={post.title}
                        className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-lg"
                        loading="lazy"
                    />
                </div>
                <div className="mt-4 flex flex-col">
                    <h2 className="text-xl font-semibold group-hover:text-[#00b5f1]">{post.title}</h2>
                    <span className="flex items-center text-xs font-semibold gap-1 my-2 text-[#858585]">
                        <MdOutlineDateRange />
                        {/* <span>{formatDate(posts[0].updateAt)}</span> */}
                        <span>{formatDate(post.updateAt)}</span>
                        {/* <span> - </span>
                            <span>{posts[0].userId.fullname}</span> */}
                    </span>
                    <p
                        className="line-clamp-3 overflow-hidden text-ellipsis text-base mb-4 "
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                    ></p>
                </div>
            </NavLink>
        </div>
    );
}

export default NewsItemMax;
