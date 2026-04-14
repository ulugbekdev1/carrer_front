import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import { menu, searchicon, logo } from "../../image";
import { useLocation, useNavigate } from "react-router-dom";
import StaggeredDropDown from "./dropdown";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { FaGraduationCap, FaUserGraduate } from "react-icons/fa";

const Navbar = ({ testId, onSidebarToggle }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("register"));
    if (userData) {
      setUser(userData);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("register");
    toast.success("Tizimdan chiqdingiz");
    navigate("/login");
  };

  // Foydalanuvchi roli (backenddan kelgan ma'lumotga qarab)
  const getUserRole = () => {
    // Backenddan kelgan role ga qarab o'zbekcha nom qaytaradi
    const role = user?.role;
    switch (role) {
      case 'student':
        return 'O\'quvchi';
      case 'cadet':
        return 'Kursant';
      case 'admin':
        return 'Admin';
      default:
        return 'Foydalanuvchi';
    }
  };

  const getRoleIcon = (role) => {
    const userRole = user?.role;
    switch (userRole) {
      case 'student':
        return <FaUserGraduate size={16} />;
      case 'cadet':
        return <FaGraduationCap size={16} />;
      case 'admin':
        return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>;
      default:
        return <FaUserGraduate size={16} />;
    }
  };

  const getRoleBadgeColor = (role) => {
    const userRole = user?.role;
    switch (userRole) {
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'cadet':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const userNavItems = [
    {
      id: 1,
      title: "Boshqaruv paneli",
      link: `/user/dashboard`,
      icon: Dashboard(
        pathname.split("/").includes("dashboard") ? "#fff" : "#696F79"
      ),
    },
    {
      id: 2,
      title: "Sertifikatlar",
      link: `/user/certificates`,
      icon: Certificates(
        pathname.split("/").includes("certificates") ? "#fff" : "#696F79"
      ),
    },
    {
      id: 3,
      title: "Test",
      link: `/user/test/${testId ? testId : "no"}`,
      icon: Test(pathname.split("/").includes("test") ? "#fff" : "#696F79"),
    },
    {
      id: 4,
      title: "Qo'llab-quvvatlash",
      link: `/user/support`,
      icon: Support(
        pathname.split("/").includes("support") ? "#fff" : "#696F79"
      ),
    },
  ];
  
  return (
    <nav className="z-[999] px-6 w-full sticky top-0 left-0 h-[70px] flex justify-between items-center bg-white border-b border-gray-200 shadow-lg backdrop-blur-sm">
      {/* Hamburger (faqat mobilda) */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 mr-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <img src={menu} alt="menu" className="w-6 h-6" />
      </button>
      
      {/* Logo va Role Badge */}
      <div className="flex items-center gap-4">
       
        
        {/* Role Badge */}
        {user && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg ${getRoleBadgeColor(getUserRole())} border border-white/20`}>
            {getRoleIcon(getUserRole())}
            <span>{getUserRole()}</span>
          </div>
        )}
      </div>

      <div className="flex-1" />
      
      {/* User info */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-3 hover:bg-gray-50 transition-all duration-300 focus:outline-none px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.first_name?.[0]?.toUpperCase()}
            </div>
            <div className="text-left max-sm:hidden">
              <div className="text-[15px] font-semibold text-gray-800">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-[13px] text-gray-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online
              </div>
            </div>
          </button>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-200"
            >
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {user.first_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getRoleBadgeColor(getUserRole())}`}>
                  {getRoleIcon(getUserRole())}
                  {getUserRole()}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/user/settings");
                }}
                className="w-full px-5 py-3 text-left text-[14px] font-medium text-gray-700 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Mening ma'lumotlarim
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-5 py-3 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                Chiqish
              </button>
            </motion.div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

function Dashboard(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
    >
      <path
        d="M6.375 18.875H2.20833C1.0625 18.875 0.125 17.9375 0.125 16.7917V2.20833C0.125 1.0625 1.0625 0.125 2.20833 0.125H6.375C7.52083 0.125 8.45833 1.0625 8.45833 2.20833V16.7917C8.45833 17.9375 7.52083 18.875 6.375 18.875ZM12.625 18.875H16.7917C17.9375 18.875 18.875 17.9375 18.875 16.7917V11.5833C18.875 10.4375 17.9375 9.5 16.7917 9.5H12.625C11.4792 9.5 10.5417 10.4375 10.5417 11.5833V16.7917C10.5417 17.9375 11.4792 18.875 12.625 18.875ZM18.875 5.33333V2.20833C18.875 1.0625 17.9375 0.125 16.7917 0.125H12.625C11.4792 0.125 10.5417 1.0625 10.5417 2.20833V5.33333C10.5417 6.47917 11.4792 7.41667 12.625 7.41667H16.7917C17.9375 7.41667 18.875 6.47917 18.875 5.33333Z"
        fill={color}
      />
    </svg>
  );
}

function Certificates(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill={color}
      viewBox="0 0 256 256"
    >
      <path d="M128,136a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h48A8,8,0,0,1,128,136Zm-8-40H72a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm112,65.47V224A8,8,0,0,1,220,231l-24-13.74L172,231A8,8,0,0,1,160,224V200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216a16,16,0,0,1,16,16V86.53a51.88,51.88,0,0,1,0,74.94ZM160,184V161.47A52,52,0,0,1,216,76V56H40V184Zm56-12a51.88,51.88,0,0,1-40,0v38.22l16-9.16a8,8,0,0,1,7.94,0l16,9.16Zm16-48a36,36,0,1,0-36,36A36,36,0,0,0,232,124Z"></path>
    </svg>
  );
}

function Test(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill={color}
      viewBox="0 0 256 256"
    >
      <path d="M216,40H40A16,16,0,0,0,24,56V216a8,8,0,0,0,11.58,7.16L64,208.94l28.42,14.22a8,8,0,0,0,7.16,0L128,208.94l28.42,14.22a8,8,0,0,0,7.16,0L192,208.94l28.42,14.22A8,8,0,0,0,232,216V56A16,16,0,0,0,216,40Zm0,163.06-20.42-10.22a8,8,0,0,0-7.16,0L160,207.06l-28.42-14.22a8,8,0,0,0-7.16,0L96,207.06,67.58,192.84a8,8,0,0,0-7.16,0L40,203.06V56H216ZM60.42,167.16a8,8,0,0,0,10.74-3.58L76.94,152h38.12l5.78,11.58a8,8,0,1,0,14.32-7.16l-32-64a8,8,0,0,0-14.32,0l-32,64A8,8,0,0,0,60.42,167.16ZM96,113.89,107.06,136H84.94ZM136,128a8,8,0,0,1,8-8h16V104a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H176v16a8,8,0,0,1-16,0V136H144A8,8,0,0,1,136,128Z"></path>
    </svg>
  );
}

function Support(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M11.5002 2.08337C5.75641 2.08337 1.0835 6.75629 1.0835 12.5V16.8157C1.0835 17.8823 2.01787 18.75 3.16683 18.75H4.2085C4.48476 18.75 4.74971 18.6403 4.94507 18.4449C5.14042 18.2496 5.25016 17.9846 5.25016 17.7084V12.3511C5.25016 12.0748 5.14042 11.8099 4.94507 11.6145C4.74971 11.4192 4.48476 11.3094 4.2085 11.3094H3.26266C3.84183 7.27817 7.31058 4.16671 11.5002 4.16671C15.6897 4.16671 19.1585 7.27817 19.7377 11.3094H18.7918C18.5156 11.3094 18.2506 11.4192 18.0553 11.6145C17.8599 11.8099 17.7502 12.0748 17.7502 12.3511V18.75C17.7502 19.899 16.8158 20.8334 15.6668 20.8334H13.5835V19.7917H9.41683V22.9167H15.6668C17.9647 22.9167 19.8335 21.048 19.8335 18.75C20.9825 18.75 21.9168 17.8823 21.9168 16.8157V12.5C21.9168 6.75629 17.2439 2.08337 11.5002 2.08337Z"
        fill={color}
      />
    </svg>
  );
}

