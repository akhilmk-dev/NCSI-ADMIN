import React from "react";


//Email

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";
// import ForgetPwd from "../pages/Authentication/ForgetPassword";

//  // Inner Authentication

// Dashboard
import Dashboard from "../pages/Dashboard/index";
// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";


//Ui

//Pages
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import Notifications from "pages/Notification/Notifications";
import UserList from "pages/Users/UserList";

import UserProfile from "pages/UserProfile/UserProfile";
import ChangePassword from "pages/UserProfile/ChangePassword";
import { Navigate } from "react-router-dom";
import SettingsList from "pages/settings/settingsList";
import Otp from "pages/Authentication/Otp";
import Pages403 from "pages/Utility/pages-403";
import SliderList from "pages/sliders/SliderList";
import EventList from "pages/Events/EventList";
import PublicationList from "pages/Publications/PublicationList";
import ClassificationList from "pages/classifications/ClassificationList";
import PopulationList from "pages/populations/PopulationList";

const userRoutes = [
  // { path: "/", component: <Navigate to="/dashboard" /> },
  { path: "/dashboard", component: <Dashboard /> },

  // //profile
  { path: "/profile", component: <UserProfile /> },

  //Charts
  { path: "/apex-charts", component: <ChartApex /> },
  { path: "/chartjs-charts", component: <ChartjsChart /> },
  { path: "/e-charts", component: <EChart /> },
  { path: "/sparkline-charts", component: <SparklineChart /> },

  // this route should be at the end of all other routes
   {path:"/notifications",component:<Notifications />},
   {path:"/users", component :<UserList />},
   {path:"/Sliders",component:<SliderList />},
   {path:"/publications",component:<PublicationList/>},
   {path:"/classifications",component:<ClassificationList/>},
   {path:"/events",component:<EventList/>},
   {path:"/populations",component:<PopulationList />},
   {path:"/profile/:id",component:<UserProfile />},
   {path:"/changePassword", component:<ChangePassword />},
   {path:"/settings", component:<SettingsList />},
];

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  {path:"/otp/:id", component:<Otp />},
  // { path: "/forgot-password", component: <ForgetPwd /> },
  // { path: "/register", component: <Register /> },
  // { path: "/pages-maintenance", component: <PagesMaintenance /> },
  // { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  {path:"/pages-403", component:<Pages403 />},
  { path: "/pages-500", component: <Pages500 /> },

  //Authentication Inner

];

export { userRoutes, authRoutes };
