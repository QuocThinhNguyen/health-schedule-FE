import React, { useState, useEffect, useRef } from 'react';

const DualRangeSlider = ({
    minBoundaryValue = 0,
    maxBoundaryValue = 2500000,
    minValue: initialMinValue = 100000,
    maxValue: initialMaxValue = 1000000,
    step = 1000,
    onChange,
}) => {
    const [minValue, setMinValue] = useState(initialMinValue);
    const [maxValue, setMaxValue] = useState(initialMaxValue);
    const progressRef = useRef(null);
    const minInputRef = useRef(null);
    const maxInputRef = useRef(null);

    useEffect(() => {
        console.log('1');
        console.log('minValue', minValue);
        console.log('maxValue', maxValue);
        console.log('minBoundaryValue', minBoundaryValue);
        console.log('maxBoundaryValue', maxBoundaryValue);
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const handleProgress = () => {
        if (progressRef.current) {
            const minPos = ((minValue - minBoundaryValue) / (maxBoundaryValue - minBoundaryValue)) * 100;
            const maxPos = ((maxValue - minBoundaryValue) / (maxBoundaryValue - minBoundaryValue)) * 100;
            progressRef.current.style.left = minPos + '%';
            progressRef.current.style.width = maxPos - minPos + '%';
        }
    };

    const handleMinChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        value = Math.min(Number(value), maxValue - 1); // Giới hạn minValue không vượt quá maxValue
        setMinValue(value);
        onChange && onChange(value, maxValue); // Truyền giá trị min và max ra ngoài
    };

    const handleMaxChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        value = Math.max(Number(value), minValue + 1); // Giới hạn maxValue không nhỏ hơn minValue
        setMaxValue(value);
        onChange && onChange(minValue, value); // Truyền giá trị min và max ra ngoài
    };

    useEffect(() => {
        handleProgress();
    }, [minValue, maxValue]);

    return (
        <div className="w-full relative mx-auto ">
            <div className="flex w-full h-9 items-center mb-3">
                <div className="absolute w-full h-1 bg-gray-200 rounded"></div>
                <div ref={progressRef} className="absolute h-1 bg-[#2D87F3] rounded"></div>
                <input
                    type="range"
                    min={minBoundaryValue}
                    max={maxBoundaryValue}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    className="absolute top-[9px] w-full cursor-pointer pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2D87F3] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#2D87F3] [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#2D87F3] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#2D87F3] [&::-moz-range-thumb]:appearance-none"
                />
                <input
                    type="range"
                    min={minBoundaryValue}
                    max={maxBoundaryValue}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="absolute top-[9px] w-full cursor-pointer pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#2D87F3] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#2D87F3] [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#2D87F3] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#2D87F3] [&::-moz-range-thumb]:appearance-none"
                />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
                <input
                    ref={minInputRef}
                    type="text"
                    className="flex-1 max-w-28 text-center border border-[#E4E8EC] p-2 rounded-lg leading-6"
                    value={formatPrice(minValue)} // Hiển thị giá trị định dạng
                    onChange={handleMinChange} // Cập nhật giá trị nhập
                />
                {/* <p className='font-bold text-xl mb-1'>~</p> */}
                <input
                    ref={maxInputRef}
                    type="text"
                    className=" flex-1 max-w-28 text-center border border-[#E4E8EC] p-2 rounded-lg leading-6"
                    value={formatPrice(maxValue)} // Hiển thị giá trị định dạng
                    onChange={handleMaxChange} // Cập nhật giá trị nhập
                />
            </div>
        </div>
    );
};

export default DualRangeSlider;
