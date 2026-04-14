import React, { useEffect, startTransition } from "react"; // Import startTransition
import Navbar from "./navbar";
import Footer from "./footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/") {
      startTransition(() => {
        navigate("/home");
      });
    }
  }, [pathname, navigate]); // Include pathname and navigate in the dependencies array

  return (
    <div>
      <Navbar />
      <div id="app-landing">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
