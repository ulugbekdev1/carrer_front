import React, { useEffect } from "react";
import Saidbar from "./saidbar";
import Navbar from "./navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    console.log(pathname)
    if (pathname === '/admin') {
      navigate(`/admin/dashboard`);
    }
    const register = JSON.parse(localStorage.getItem("register"));
    if (register) {
      if (register.role === "user") {
        navigate("/home");
      } else {
        navigate(`/${register.role}/dashboard`);
      }
      return;
    }
    navigate(`/login`);
  }, []);
  return (
    <main className="max-w-[1440px] mx-auto flex justify-start">
      <Saidbar />
      <div className="w-[75%]">
        <Navbar />
        <div className="main p-4">
          <div className="relative w-full h-full py-[24px] px-[40px]">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};



export default Admin;
