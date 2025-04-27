import { MdOutlineDateRange } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {formatDate} from '~/utils/formatDate';
import { formatTitleForUrl } from '~/utils/formatTitleForUrl';

function NewsItem(data) {

    const post = data.data;
    return (
        <div className="p-2 h-full group">
            <NavLink
                to={`/tin-tuc/${formatTitleForUrl(post.title)}-${post.postId}`}
                className="cursor-pointer group-hover:shadow-xl p-3 block bg-white rounded-xl h-full"
            >
                <div className="w-full h-48 max-h-48">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-0 h-0 min-w-full max-w-full min-h-full max-h-full object-cover rounded-lg"
                        loading="lazy"
                    />
                </div>
                <div className="mt-4 flex flex-col">
                    <h2 className="text-base font-semibold group-hover:text-[#00b5f1]">
                        {post.title}
                    </h2>
                    <span className="flex items-center text-sm gap-1 my-1 text-[#858585]">
                        <MdOutlineDateRange />
                        {/* <span>{formatDate(posts[0].updateAt)}</span> */}
                        <span>{formatDate(post.updateAt)}</span>
                        {/* <span> - </span>
                        <span>{posts[0].userId.fullname}</span> */}
                    </span>
                </div>
            </NavLink>
        </div>
    );
}

export default NewsItem;
