import SearchInput from './SearchInput';

function Search() {
//#E3F2FF
    return (
        <div className="bg-[#fff]">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="px-8 py-6 flex items-center flex-col">
                    <div className="flex flex-col items-center">
                        <h3 className="font-bold text-4xl mb-3 text-[#2D87F3]">Đặt khám tại EasyMed - Bác sĩ ơi</h3>
                        <p>Để được tiếp đón ưu tiên, không chờ đợi tại các bệnh viện, phòng khám hàng đầu</p>
                    </div>
                    <SearchInput/>
                </div>
            </div>
        </div>
    );
}

export default Search;
