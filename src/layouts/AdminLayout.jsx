import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import SidebarAdmin from '~/components/SidebarAdmin';
import HeaderAdmin from '~/components/HeaderAdmin';
import { ThemeContext } from '~/context/ThemeProvider';
function AdminLayout() {
    const { isDark, tonggleTheme } = useContext(ThemeContext);
    return (
        <div className={`flex ${isDark ? 'dark' : ''}`}>
            <div className="w-60 bg-[var(--bg-primary)]">
                <SidebarAdmin />
            </div>
            <div className="flex-1">
                <HeaderAdmin />
                <main className="w-full overflow-y-auto h-screen-admin bg-[var(--bg-secondary)] mt-[68px]">
                    <Outlet />
                </main>
            </div>

            {/* <div className="h-screen-minus-20 ">
                
                <HeaderAdmin />
                <main className="w-full overflow-y-auto bg-[#f3f4f7]">
                    <Outlet />
                </main>
            </div> */}
        </div>
    );
}

export default AdminLayout;
