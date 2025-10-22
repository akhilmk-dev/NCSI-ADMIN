import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { connect } from "react-redux"
import 'quill/dist/quill.snow.css'; 
// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"

// layouts Format
import NonAuthLayout from "./components/NonAuthLayout"

// Import scss
import "./assets/scss/theme.scss"

import { Toaster } from 'react-hot-toast'
import Pages404 from 'pages/Utility/pages-404'
import Cookies from 'js-cookie'


const App = () => {
  const navigate = useNavigate()
  // const hasPermission = (path) => {
  //   const userPermissions = localStorage?.getItem("permissions");

  //   if (!userPermissions) {
  //     const allCookies = Cookies.get();
  //     for (const cookieName in allCookies) {
  //       Cookies.remove(cookieName);
  //     }
  //     navigate('/login');
  //     return false;
  //   }

  //   const permissions = JSON.parse(userPermissions);
  //   const pageUrls = new Set(permissions.map(p => p.pageUrl));
  //   const searchParams = new URLSearchParams(window.location.search);

  //   const permissionMap = {
  //     '/createCatalogue': { add: 'Add Catalogues', edit: 'Edit Catalogues' },
  //     '/createCustomer': { add: 'Add Customers', edit: 'Edit Customers' },
  //     '/createRole': { add: 'Add Roles', edit: 'Edit Roles' },
  //   };

  //   if (permissionMap[path]) {
  //     const isEdit = searchParams.has('id');
  //     const requiredPermission = isEdit ? permissionMap[path].edit : permissionMap[path].add;
  //     return permissions.some(p => p.permissionName === requiredPermission);
  //   }
  //   // console.log('path' ,path)

  //   const relatedPaths = {
  //     "/workorders": "/createWorkOrder",
  //     "/sitesurveys": "/createSiteSurvey",
  //     "/catalogues": "/createCatalogue",
  //     "/customers": "/createCustomer",
  //     "/roles": "/createRole",
  //   };

  //   if (relatedPaths[path] && pageUrls.has(relatedPaths[path])) {
  //     return true;
  //   }

  //   return pageUrls.has(path);
  // }

  // Helper to wrap routes with permission check
  // const ProtectedRoute = ({ path, component }) => {
  //   const navigate = useNavigate() // Using useNavigate hook

  //   useEffect(() => {
  //     if (!isDynamicRoute(path) && !hasPermission(path)) {
  //       navigate('/pages-403') // Redirect to 404 page if permission is denied
  //     }
  //   }, [path, navigate])

  //   if (isDynamicRoute(path) || hasPermission(path)) {
  //     return component
  //   } else {
  //     return null // Render nothing while the redirection is happening
  //   }
  // }

  // Function to check if the route is dynamic
  // const isDynamicRoute = (path) => {
  //   return /:.+/.test(path) 
  // }
  return (
    <React.Fragment>
      <Toaster toastOptions={{
    duration: 5000,
    style: {
      fontSize: '18px',      
      
    },
  }}
  />
      <Routes>
        <Route>
          {authRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <NonAuthLayout>
                  {route.component}
                </NonAuthLayout>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route>
          {userRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Authmiddleware>
                  {/* <ProtectedRoute key={route.path} path={route.path} component={route.component} /> */}
                  {route.component}
                </Authmiddleware>}
              key={idx}
              exact={true}

            />
          ))}
        </Route>
        <Route path="*" element={<Pages404 />} />
      </Routes>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
