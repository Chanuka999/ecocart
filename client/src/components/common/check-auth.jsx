import React from "react";
import { useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  return <div></div>;
};

export default CheckAuth;
