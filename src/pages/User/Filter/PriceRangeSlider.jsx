import React, { useCallback, useEffect, useState, useRef } from 'react';
import './PriceRangeSlider.css';

const valueCSS = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    gap: '2px',
    paddingTop: '10px',
};

const PriceRangeSlider = ({
    min,
    max,
    trackColor = '#cecece',
    onChange,
    rangeColor = '#2D87F3',
    valueStyle = valueCSS,
    width = '100%',
    currencyText = '$',
    values,
}) => {
    const [minVal, setMinVal] = useState(values.min);
    const [maxVal, setMaxVal] = useState(values.max);
    const minValRef = useRef(values.min);
    const maxValRef = useRef(values.max);
    const range = useRef(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    // convert to percentage
    const getPercent = useCallback((value) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

    // set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // set the width of the range to decrease from right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        if (minVal != minValRef.current || maxVal != maxValRef.current) {
            onChange({ min: minVal, max: maxVal });
            minValRef.current = minVal;
            maxValRef.current = maxVal;
        }
    }, [minVal, maxVal, onChange]);

    return (
        <div className="w-full flex items-center justify-center flex-col gap-5 pt-2">
            {/* Style the price range slider */}
            <div className="relative w-full" style={{ width }}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        setMinVal(value);
                    }}
                    className="thumb thumb-left"
                    style={{
                        width,
                        zIndex: minVal > max - 100 || minVal === maxVal ? 5 : undefined,
                    }}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        setMaxVal(value);
                    }}
                    className="thumb thumb-right"
                    style={{
                        width,
                        zIndex: minVal > max - 100 || minVal === maxVal ? 4 : undefined,
                    }}
                />

                <div className="slider">
                    <div style={{ backgroundColor: trackColor }} className="track-slider" />

                    <div ref={range} style={{ backgroundColor: rangeColor }} className="range-slider" />
                </div>
            </div>

            {/* Display Price Value */}
            <div className="w-full flex items-center justify-between gap-x-5">
                <p className="flex-1 max-w-28 bg-white text-center border border-[#E4E8EC] p-2 rounded-lg leading-6">
                    {formatPrice(minVal)}
                </p>
                <p className="flex-1 max-w-28 bg-white text-center border border-[#E4E8EC] p-2 rounded-lg leading-6">
                    {formatPrice(maxVal)}
                </p>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
