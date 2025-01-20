import React, { useState, useEffect } from 'react';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

const Pagination = ({ currentPage, totalPages = 6, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1); // always show first page
            if (currentPage > 3) pageNumbers.push('...'); // show ellipsis if not close to the beginning
            for (let i = Math.max(currentPage - 1, 2); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
                pageNumbers.push(i);
            }
            if (currentPage < totalPages - 2) pageNumbers.push('...'); // show ellipsis if not close to the end
            pageNumbers.push(totalPages); // always show last page
        }
        return pageNumbers;
    };

    return (
        <div className="flex items-center justify-center gap-4 my-12">
            {/* First Page Button */}
            <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="min-w-8 h-8 bg-white text-[#00b5f1] font-normal flex items-center justify-center border border-transparent shadow-[0_3px_15px_rgba(116,_157,_206,_0.2)] transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
                aria-label="First page"
            >
                <MdKeyboardDoubleArrowLeft />
            </button>

            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-8 h-8 bg-white text-[#00b5f1] font-normal flex items-center justify-center border border-transparent shadow-[0_3px_15px_rgba(116,_157,_206,_0.2)] transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
                aria-label="Previous page"
            >
                <MdKeyboardArrowLeft />
            </button>

            {/* Page Number Buttons */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => page !== '...' && handlePageChange(page)}
                    className={`min-w-8 h-8 bg-white text-[#00b5f1] font-normal flex items-center justify-center border border-transparent rounded-md shadow-[0_3px_15px_rgba(116,_157,_206,_0.2)] transition-all duration-200 ease-in-out ${
                        currentPage === page
                            ? 'bg-gradient-to-r from-[#00b5f1] to-[#00e0ff] text-white '
                            : 'hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="min-w-8 h-8 bg-white text-[#00b5f1] font-normal flex items-center justify-center border border-transparent shadow-[0_3px_15px_rgba(116,_157,_206,_0.2)] transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
                aria-label="Next page"
            >
                <MdKeyboardArrowRight />
            </button>

            {/* Last Page Button */}
            <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="min-w-8 h-8 bg-white text-[#00b5f1] font-normal flex items-center justify-center border border-transparent shadow-[0_3px_15px_rgba(116,_157,_206,_0.2)]  transition-all duration-200 ease-in-out hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:hover:bg-transparent"
                aria-label="Last page"
            >
                <MdKeyboardDoubleArrowRight />
            </button>
        </div>
    );
};

export default Pagination;
