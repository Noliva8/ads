import { NavLink, Outlet } from "react-router-dom";

// Owner Dashboard components
import AppBar from "../../pages/dashboardPages/global/AppBar";
import SideBar from "../../pages/dashboardPages/global/SideBar";

export default function OwnerLayout() {
  return (
    <div className="dashboard-container">
      <SideBar />
      <main className="dashboard-main-content">
        <AppBar />
        <Outlet />
      </main>
    </div>
  );
}