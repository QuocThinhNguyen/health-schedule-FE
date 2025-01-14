import React, { useState, useEffect, useRef } from 'react';

const DualRangeSlider = ({
    minBoundaryValue,
    maxBoundaryValue,
    minValue: initialMinValue,
    maxValue: initialMaxValue,
    step = 0,
    onChange,
}) => {
    const [minValue, setMinValue] = useState(initialMinValue);
    const [maxValue, setMaxValue] = useState(initialMaxValue);
    const progressRef = useRef(null);
    const minInputRef = useRef(null);
    const maxInputRef = useRef(null);

    useEffect(() => {
        console.log('1');
        console.log("minValue", minValue);
        console.log("maxValue", maxValue);
        console.log("minBoundaryValue", minBoundaryValue);
        console.log("maxBoundaryValue", maxBoundaryValue);
        
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
        <div className="w-full mx-auto mt-2">
            <div className="flex justify-between gap-2 mb-6 items-center">
                <input
                    ref={minInputRef}
                    type="text"
                    className="text-center min-w-40 border border-gray-300 px-3 py-2 rounded-lg"
                    value={formatPrice(minValue)} // Hiển thị giá trị định dạng
                    onChange={handleMinChange} // Cập nhật giá trị nhập
                />
                <p>~</p>
                <input
                    ref={maxInputRef}
                    type="text"
                    className="text-center min-w-40 border border-gray-300 px-3 py-2 rounded-lg"
                    value={formatPrice(maxValue)} // Hiển thị giá trị định dạng
                    onChange={handleMaxChange} // Cập nhật giá trị nhập
                />
            </div>
            <div className="relative w-full mt-8 h-2">
                <div className="absolute w-full h-[3px] bg-gray-200 rounded"></div>
                <div ref={progressRef} className="absolute h-[3px] bg-blue-500 rounded"></div>
                <input
                    type="range"
                    min={minBoundaryValue}
                    max={maxBoundaryValue}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    className="absolute top-[-5px] w-full cursor-pointer pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
                />
                <input
                    type="range"
                    min={minBoundaryValue}
                    max={maxBoundaryValue}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="absolute top-[-5px] w-full cursor-pointer pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-500 [&::-moz-range-thumb]:appearance-none"
                />
            </div>
        </div>
    );
};

export default DualRangeSlider;
