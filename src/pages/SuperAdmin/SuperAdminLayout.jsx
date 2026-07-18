import { NavLink, Outlet } from "react-router-dom";

export default function SuperAdminLayout() {
    return (
        <div>
            <header>
                <h1>Super Admin Dashboard</h1>
                <nav>
                    <NavLink to="/super-admin" end>Overview</NavLink>{" | "}
                    <NavLink to="/super-admin/manage-adverts">Adverts</NavLink>{" | "}
                    <NavLink to="/super-admin/manage-songs">Songs</NavLink>{" | "}
                    <NavLink to="/super-admin/metadata">Metadata</NavLink>{" | "}
                    <NavLink to="/super-admin/settings">Settings</NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
