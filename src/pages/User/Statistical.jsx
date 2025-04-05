import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FaUserDoctor } from 'react-icons/fa6';
import { FaHospital, FaUser } from 'react-icons/fa';
import { AiOutlineSchedule } from 'react-icons/ai';

function Statistical() {
    const ITEMS = useMemo(
        () => [
            {
                id: 1,
                key: 'Tổng số lần khám bệnh',
                value: 50,
                backgroundColor: 'bg-[linear-gradient(45deg,_rgb(88,86,214)_0%,_rgb(111,103,219)_100%)]',
                icon: <FaUserDoctor />,
            },
            {
                id: 2,
                key: 'Tổng hồ sơ khám bệnh',
                value: 4,
                backgroundColor: 'bg-[linear-gradient(45deg,_rgb(51,153,255)_0%,_rgb(41,130,204)_100%)]',
                icon: <FaHospital />,
            },
            {
                id: 3,
                key: 'Tổng chi phí khám bệnh',
                value: 100000,
                backgroundColor: 'bg-[linear-gradient(45deg,_rgb(249,177,21)_0%,_rgb(246,150,11)_100%)]',
                icon: <FaUser />,
            },
            {
                id: 4,
                key: 'Số lần khám tháng này',
                value: 2,
                backgroundColor: 'bg-[linear-gradient(45deg,_rgb(229,83,83)_0%,_rgb(217,55,55)_100%)]',
                icon: <AiOutlineSchedule />,
            },
        ],
        [],
    );
    return (
        <div className="mt-20 fit w-full h-fit">
            <div className="text-2xl text-black font-bold mb-1 text-start">Thống kê</div>
            <div className="flex flex-wrap justify-between gap-2 mt-8 text-white">
                {ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={`${item.backgroundColor} rounded-lg flex-1 px-2 flex items-center gap-4`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                            <p>{item.key}</p>
                            <p className="text-xl font-bold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistical;
