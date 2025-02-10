import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '~/context/UserContext';
import SidebarAdmin from '~/components/SidebarAdmin';
import HeaderAdmin from '~/components/HeaderAdmin';
function AdminLayout() {
    return (
        <div className="h-screen-minus-20 ">
            <HeaderAdmin />
            <div className="flex mt-20 h-screen-minus-20 ">
                <SidebarAdmin />
                <main className="w-full overflow-y-auto bg-[#f3f4f7]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
