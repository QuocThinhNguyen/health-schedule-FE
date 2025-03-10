import { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { toast } from 'react-toastify';
import { axiosClient } from '~/api/apiRequest';
import SearchClinic from './SearchClinic';
import SearchDoctor from './SearchDoctor';
import { useNavigate } from 'react-router-dom';

function SearchInput({ initialSearchValue = '' }) {
    const [isOpenHistory, setIsOpenHistory] = useState(false);
    const historyRef = useRef(null);
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState(initialSearchValue);

    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (historyRef.current && !historyRef.current.contains(e.target)) {
                setIsOpenHistory(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [historyRef]);

    useEffect(() => {
        const fetchSearchClinics = async () => {
            try {
                const response = await axiosClient.get(`/clinic?query=${searchValue}&limit=100`);
                if (response.status === 200) {
                    setClinics(response.data);
                } else {
                    toast.error(response.message);
                    setClinics([]);
                }
            } catch (error) {
                toast.error(error);
                setClinics([]);
            }
        };

        const fetchSearchDoctors = async () => {
            try {
                const response = await axiosClient.get(`/doctor/search?keyword=${searchValue}&limit=100`);
                if (response.status === 200) {
                    setDoctors(response.data);
                } else {
                    toast.error(response.message);
                    setDoctors([]);
                }
            } catch (error) {
                toast.error(error);
                setDoctors([]);
            }
        };

        if (searchValue !== '') {
            fetchSearchClinics();
            fetchSearchDoctors();
        }
    }, [searchValue]);

    const handleSearch = () => {
        const trimmedSearchValue = searchValue.trim();
        if (trimmedSearchValue) {
            navigate(`/tat-ca-bac-si/?keyword=${encodeURIComponent(trimmedSearchValue)}`);
        } else {
            navigate(`/tat-ca-bac-si`);
        }
    };
    
    const handleAllClinic = () => {
        const trimmedSearchValue = searchValue.trim();
        if (trimmedSearchValue) {
            navigate(`/tat-ca-benh-vien/?keyword=${encodeURIComponent(trimmedSearchValue)}`);
        } else {
            navigate(`/tat-ca-benh-vien`);
        }
    };
    
    const handleAllDoctor = () => {
        const trimmedSearchValue = searchValue.trim();
        if (trimmedSearchValue) {
            navigate(`/tat-ca-bac-si/?keyword=${encodeURIComponent(trimmedSearchValue)}`);
        } else {
            navigate(`/tat-ca-bac-si`);
        }
    };

    return (
        <div className="px-4 py-6 w-full flex-1 ">
            <div className="flex items-start justify-center gap-2">
                <div ref={historyRef} className="flex-1 flex flex-col items-start gap-2 relative">
                    <div className=" bg-white w-full flex items-center justify-center h-12 gap-2 border border-gray-300 rounded-lg px-4 shadow-sm">
                        <IoIosSearch className="w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="flex-1 h-12 outline-none border-y border-gray-300"
                            onFocus={() => setIsOpenHistory(true)}
                            value={searchValue}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    {isOpenHistory && searchValue && (
                        <div className="w-full shadow-2xl rounded-lg max-h-96 overflow-auto absolute bg-white top-14 left-0 right-0 z-10">
                            {/* benh vien */}
                            {clinics.length > 0 && (
                                <div>
                                    <div className="px-6 py-2 rounded-tl-lg rounded-tr-lg font-semibold text-[rgb(38,38,38)] bg-[#e6f2ff] flex justify-between items-center">
                                        <p>Bệnh viện</p>
                                        <p onClick={handleAllClinic} className="text-[rgb(45,135,243)] cursor-pointer font-normal hover:underline">
                                            Xem tất cả
                                        </p>
                                    </div>
                                    <div>
                                        {/* list benh vien */}
                                        {clinics.map((clinic, index) => (
                                            <SearchClinic key={index} data={clinic} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* bac si */}
                            {doctors.length > 0 && (
                                <div>
                                    <div className="px-6 py-2 font-semibold text-[rgb(38,38,38)] bg-[#e6f2ff] flex justify-between items-center">
                                        <p>Bác sĩ</p>
                                        <p onClick={handleAllDoctor} className="text-[rgb(45,135,243)] cursor-pointer font-normal hover:underline">
                                            Xem tất cả
                                        </p>
                                    </div>
                                    <div>
                                        {/* list benh vien */}
                                        {doctors.map((doctor, index) => (
                                            <SearchDoctor key={index} data={doctor} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-[#2d87f3] hover:bg-[#2c74df] text-white font-semibold rounded-lg text-xl px-7 h-12 "
                >
                    Tìm kiếm
                </button>
            </div>
            {/* <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full bg-blue-50 px-4 py-1 text-sm text-blue-600 hover:bg-blue-100">
                    Tư khoa Phổ Biến
                </button>
                <button className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200">Khám nhi</button>
                <button className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200">
                    Khám sản phụ khoa
                </button>
                <button className="rounded-full bg-gray-100 px-4 py-1 text-sm hover:bg-gray-200">
                    Gói khám sức khỏe
                </button>
            </div> */}
        </div>
    );
}

export default SearchInput;
