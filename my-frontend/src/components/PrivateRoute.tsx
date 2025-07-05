import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { Outlet,Navigate } from 'react-router-dom';
const PrivateRoute: React.FC = () =>{
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
if (!isAuthenticated) {
    return <Navigate to="/dangnhap" />;
  }
return <Outlet/>

};
export default PrivateRoute;