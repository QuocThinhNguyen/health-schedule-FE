import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";


function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
        <>
            {Array.from({ length: fullStars }, (_, index) => (
                <BsStarFill  key={`full-${index}`} className="text-lg mr-2" />
            ))}
            {Array.from({ length: halfStars }, (_, index) => (
                <BsStarHalf  key={`half-${index}`} className="text-lg mr-2" />
            ))}
            {Array.from({ length: emptyStars }, (_, index) => (
                <BsStar key={`empty-${index}`} className="text-lg mr-2" />
            ))}
        </>
    );
}

export default renderStars;
