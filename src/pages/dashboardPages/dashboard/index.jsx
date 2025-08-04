
import Overview from "../overview"
import './dashboard.css'

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';




// Dashboard components

import AppBar from "../global/AppBar";
import SideBar from "../global/SideBar";

export default function Dashboard(){
    return(
        <div className="dashboard-container">
<SideBar />

<main  className="dashboard-main-content">
    <AppBar />
     <Outlet />
    </main> 
        </div>
    )
}