import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SearchInput from '~/pages/Home/Search/SearchInput';
import Pagination from '~/components/Pagination';

import SideBarFilterClinic from './SideBarFilterClinic';
import ListFilterClinic from './ListFilterClinic';

import SideBarFilterDoctor from './SideBarFilterDoctor';
import ListFilterDoctor from './ListFilterDoctor';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

function Filter() {
    const location = useLocation();
    const [searchParams] = new useSearchParams(location.search);
    const keyword = searchParams.get('keyword') || '';

    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(location.pathname.startsWith('/tat-ca-bac-si') ? 1 : 0);

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    useEffect(() => {
        console.log('location.pathname:', location.pathname);
        console.log('selectedTab:', selectedTab);
        if (location.pathname === '/tat-ca-bac-si' && selectedTab !== 1) {
            setSelectedTab(1);
        } else if (location.pathname === '/tat-ca-benh-vien' && selectedTab !== 0) {
            setSelectedTab(0);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (selectedTab === 0 && location.pathname !== '/tat-ca-benh-vien') {
            navigate(`/tat-ca-benh-vien/?keyword=${encodeURIComponent(keyword.trim())}`);
        } else if (selectedTab === 1 && location.pathname !== '/tat-ca-bac-si') {
            navigate(`/tat-ca-bac-si/?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    }, [selectedTab, keyword, navigate, location.pathname]);

    // useEffect(() => {
    //     if (selectedTab === 0) {
    //         navigate(`/tat-ca-benh-vien/?keyword=${encodeURIComponent(keyword.trim())}`);
    //     } else if (selectedTab === 1) {
    //         navigate(`/tat-ca-bac-si/?keyword=${encodeURIComponent(keyword.trim())}`);
    //     }
    // }, [selectedTab, navigate]);
    return (
        <div>
            <div className="bg-[#e3f2ff]">
                <ul className="max-w-6xl mx-auto  flex items-center gap-1 px-4 py-3 text-sm font-semibold">
                    <li>
                        <NavLink to="/">Trang chủ</NavLink>
                    </li>
                    <li>
                        <NavLink to="/tat-ca-benh-vien" className="flex items-center">
                            <MdKeyboardArrowRight className="mt-1" />
                            <span className="text-[#2D87F3]">{selectedTab === 0 ? 'Bệnh viện' : 'Bác sĩ'}</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="max-w-6xl mx-auto">
                <SearchInput initialSearchValue={keyword} />
                <div className=""></div>
                <div className="px-4 mb-8">
                    <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
                        <TabList className="flex items-center gap-4 text-[rgb(140,140,140)] font-bold text-base border-b border-[#BFBFBF] mb-10">
                            <Tab className="pb-2 cursor-pointer outline-none border-b-2 border-transparent aria-selected:text-[rgb(45,135,243)] aria-selected:border-b-2 aria-selected:border-[rgb(45,135,243)] ">
                                Bệnh viện
                            </Tab>
                            <Tab className="pb-2 cursor-pointer outline-none border-b-2 border-transparent aria-selected:text-[rgb(45,135,243)] aria-selected:border-b-2 aria-selected:border-[rgb(45,135,243)]">
                                Bác sĩ
                            </Tab>
                        </TabList>
                        <TabPanel>
                            <div className="flex items-start gap-6 mt-5">
                                <div className="flex-[1] min-w-72">
                                    <SideBarFilterClinic />
                                </div>
                                <div className="flex-[5]">
                                    <ListFilterClinic pagination={pagination} setPagination={setPagination} />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="flex items-start gap-6 mt-5">
                                <div className="flex-[1] min-w-72">
                                    <SideBarFilterDoctor />
                                </div>
                                <div className="flex-[5]">
                                    <ListFilterDoctor pagination={pagination} setPagination={setPagination} />
                                </div>
                            </div>
                        </TabPanel>
                        <div className="text-center">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default Filter;
