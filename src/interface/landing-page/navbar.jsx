import React, { useEffect, useRef, useState } from "react";
import { logo, logouser, logout } from "../../image";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ApiServices } from "../../components/api.service";
import StaggeredDropDown from "./dropdown";

const ctglink = [
  {
    id: 1,
    name: "Asosiy",
    link: "home",
  },
  {
    id: 2,
    name: "Kurslar",
    link: "courses",
  },
  {
    id: 3,
    name: "Imkoniyatlar",
    link: "features",
  },
  {
    id: 4,
    name: "Aloqa",
    link: "/contact",
  },
];

const Navbar = () => {
  const register = JSON.parse(localStorage.getItem("register"));
  const logOutRef = useRef();
  const burgerMenu = useRef();
  const isCloseRef = useRef();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [isSignOut, setIsSignOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const handleActiveTab = (active) => {
    setActiveTab(active.id);
    if (active.id === 4) {
      navigate(active.link);
    } else {
      const element = document.getElementById(active.link);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 88,
          behavior: "smooth",
        });
      } else {
        navigate(`/home`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("register");
    navigate("/home");
  };

  useEffect(() => {
    if (register?.user_id && !userData) {
      const fetchData = async () => {
        try {
          const user = await ApiServices.getData(`/register/users/${register?.user_id}/`);
          setUserData(user);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [register?.user_id, userData]);

  // Outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="z-50 fixed top-0 left-0 w-full h-[88px] bg-white shadow">
      <main className="w-11/12 h-full max-w-[1440px] mx-auto flex justify-between items-center">
        <NavLink to="/home" className="flex justify-start items-center gap-1">
          <img className="w-[34px] h-[34px]" src={logo} alt="Logo" />
          <h1 className="font-bold text-[40px] text-primary">Career AI</h1>
        </NavLink>
        <div className="max-md:hidden flex items-center gap-[24px]">
          {ctglink.map((item) => (
            <div
              onClick={() => handleActiveTab(item)}
              key={item.id}
              className={`${
                activeTab === item.id ? "text-[#4A3AFF]" : "text-[#667085]"
              } inline-flex rounded-[6px] mr-[12px] cursor-pointer relative py-[8px] justify-between items-center gap-[8px]`}
            >
              <h1 className="text-[16px] font-semibold relative z-10">
                {item.name}
              </h1>
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-[6px] top-[35px] h-[2px]"
                />
              )}
            </div>
          ))}
          {register && (
            <NavLink
              to="/user/dashboard"
              className="px-[18px] py-[10px] rounded-[8px] bg-[#F3F4F6] text-[16px] font-semibold text-primary hover:bg-[#e7e7e7] transition-all duration-200"
            >
              Kabinet
            </NavLink>
          )}
          {register ? (
            <div className="flex items-center gap-[24px]">
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-[600] text-[20px]">
                    {(userData?.first_name?.[0] || userData?.last_name?.[0] || "U").toUpperCase()}
                  </div>
                  {(userData?.first_name || userData?.last_name) && (
                    <span className="text-[16px] font-[500]">
                      {userData?.first_name} {userData?.last_name}
                    </span>
                  )}
                </button>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-[#ececec]"
                    style={{ minWidth: 200 }}
                  >
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/user/settings");
                      }}
                      className="w-full px-5 py-3 text-left text-[16px] font-[500] text-gray-700 hover:bg-[#f5f5ff] rounded-t-xl transition-all duration-200"
                    >
                      Mening ma'lumotlarim
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-left text-[16px] font-[500] text-red-600 hover:bg-red-50 rounded-b-xl transition-all duration-200"
                    >
                      Chiqish
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-[24px]">
              <button
                onClick={() => navigate("/login")}
                className="px-[24px] py-[18px] rounded-[10px] bg-white border-[1px] border-solid border-[#D4D2E3] text-[16px] font-bold text-[#5D5A88]"
              >
                Tizimga kirish
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-[24px] py-[18px] rounded-[10px] bg-primary text-[16px] font-bold text-white"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center">
          {register ? (
            <div className="flex items-center gap-[50px]">
              <div
                onClick={handleLogout}
                id="profil"
                className="relative cursor-pointer flex items-center gap-[15px]"
              >
                <img
                  className="cursor-pointer rounded-full w-[50px] h-[50px] object-cover"
                  src={logouser}
                  alt="Profile"
                />
                <div className="relative">
                  <h1 className="text-[19px] font-medium">{userData?.first_name}</h1>
                  <p className="text-[14px] text-gray-500">{userData?.role === "student" ? "O'quvchi" : "Kursant"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="px-[14px] py-[8px] font-medium text-[14px] border-[1px] border-thin rounded-[12px] cursor-pointer"
            >
              Kirish
            </div>
          )}
          <StaggeredDropDown navLink={ctglink} />
        </div>
      </main>
    </nav>
  );
};

export default Navbar;
