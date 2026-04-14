import React, { useState, useEffect } from "react";
import { logo } from "../../image";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut, FiX } from "react-icons/fi";
import {
  FaBookOpen,
  FaPlay,
  FaCertificate,
  FaClipboardList,
  FaCheckCircle,
  FaLock,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";

const baseUrl = "http://192.168.81.106:8000/api";

const Saidbar = ({
  open,
  onClose,
  selectedCourse,
  selectedLessons,
  doneCourses,
  loading,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("register"));
  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Fetch all available courses to determine total count
  useEffect(() => {
    const fetchAllCourses = async () => {
      if (user?.role !== 'cadet') return;
      
      setCoursesLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/courses/`, {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${user.access}`,
          },
        });
        setAllCourses(response.data);
      } catch (error) {
        console.error("Error fetching all courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchAllCourses();
  }, [user?.role, user?.access]);

  // Calculate if all courses are completed
  const isAllCoursesCompleted = React.useMemo(() => {
    // Students always have access to tests
    if (!user || user.role === 'student') {
      return true;
    }
    
    // For cadets, check if all courses are completed
    if (user.role !== 'cadet' || !doneCourses || !allCourses.length) {
      return false;
    }

    const completedCourses = doneCourses.filter(dc => dc.end_course === true);
    return completedCourses.length >= allCourses.length;
  }, [doneCourses, allCourses, user]);

  const handleLogout = () => {
    localStorage.removeItem("register");
    navigate("/login");
  };

  const currentLessonId = pathname.startsWith("/user/lesson/")
    ? pathname.split("/").pop()
    : null;

  const mainNavItems = [
    {
      id: "dashboard",
      title: "Boshqaruv paneli",
      link: "/user/dashboard",
      icon: Dashboard(pathname.includes("/dashboard") ? "#fff" : "#696F79"),
      active: pathname.includes("/dashboard"),
    },
    {
      id: "lessons",
      title: "Kurslar",
      link: "/user/lessons",
      icon: <FaBookOpen size={22} color={pathname.includes("/lessons") || pathname.includes("/course") ? "#fff" : "#696F79"} />,
      active: pathname.includes("/lessons") || pathname.includes("/course"),
      role: "cadet",
    },
    {
      id: "results",
      title: "Test Natijalari",
      link: "/user/results",
      icon: <FaChartLine size={22} color={pathname.includes("/results") ? "#fff" : "#696F79"} />,
      active: pathname.includes("/results"),
    },
    {
      id: "test",
      title: "Test",
      link: "/user/test/no",
      icon: <FaClipboardList size={22} color={pathname.includes("/test") ? "#fff" : "#696F79"} />,
      active: pathname.includes("/test"),
      locked: user?.role === 'cadet' && !isAllCoursesCompleted,
    },
  ];

  const sidebarClass = `
    fixed md:static top-0 left-0 h-full z-[1000] bg-white shadow-2xl md:shadow-none
    w-[260px] md:w-[25%] flex flex-col justify-between transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
  `;
  
  const doneCourseInfo = selectedCourse
    ? doneCourses?.find((c) => c.course.id === selectedCourse.id)
    : null;
  const points = doneCourseInfo ? doneCourseInfo.points : 0;

  const filteredLessons = selectedLessons?.filter(l => l.course?.toString() === selectedCourse?.id?.toString()) || [];

  const renderLessonItem = (lesson, lessonIdx) => {
    const isCompleted = lessonIdx < points;
    const isLocked = lessonIdx > points;
    const isActive = currentLessonId == lesson.id.toString();

    let lessonClasses = "flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left transition-all duration-200 ";
    if (isLocked) {
      lessonClasses += "cursor-not-allowed text-gray-400";
    } else if (isActive) {
      lessonClasses += "bg-primary/10 text-primary font-bold";
    } else {
      lessonClasses += "hover:bg-gray-100 text-gray-600";
    }

    return (
      <button
        key={lesson.id}
        onClick={() => !isLocked && navigate(`/user/lesson/${lesson.id}`)}
        className={lessonClasses}
        disabled={isLocked}
      >
        {isCompleted ? (
          <FaCheckCircle className="text-green-500" />
        ) : isLocked ? (
          <FaLock className="text-gray-400" />
        ) : (
          <FaPlay size={14} className="text-gray-500" />
        )}
        <span className="text-sm truncate flex-1">
          {lessonIdx + 1}. {lesson.title}
        </span>
      </button>
    );
  };

  // Check if user is student and trying to access course/lesson pages
  const isStudent = user?.role === 'student';
  const isCourseOrLessonPage = pathname.includes("/course") || pathname.includes("/lesson");
  
  // If student is on course/lesson page, redirect to dashboard
  React.useEffect(() => {
    if (isStudent && isCourseOrLessonPage) {
      navigate('/user/dashboard');
    }
  }, [isStudent, isCourseOrLessonPage, navigate]);

  // Handle test navigation with lock check
  const handleTestNavigation = () => {
    // Students always have access to tests
    if (user?.role === 'student') {
      navigate("/user/test/no");
      return;
    }
    
    // For cadets, check if all courses are completed
    if (isAllCoursesCompleted) {
      navigate("/user/test/no");
    } else {
      // Show a message that all courses must be completed first
      alert("Testlar bo'limiga kirish uchun barcha kurslarni tugatishingiz kerak!");
    }
  };

  return (
    <aside className={sidebarClass} style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 py-8 border-b relative">
        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
        <span className="font-bold text-[22px] md:text-[28px] text-primary leading-tight">
          Career AI
        </span>
        <button
          className="absolute top-4 right-4 md:hidden text-2xl text-gray-500 hover:text-primary"
          onClick={onClose}
          aria-label="Yopish"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {/* Navigation */}
      <div className="flex flex-col gap-2 mt-8 px-4 overflow-y-auto flex-1">
        {loading ? (
          <div className="text-center p-4">Yuklanmoqda...</div>
        ) : selectedCourse && !isStudent ? (
          // Course View - Only for cadet users
          <>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full flex justify-start items-center gap-3 px-4 py-3 rounded-[10px] cursor-pointer transition-all duration-200 hover:bg-[#e7e7e7] text-thin font-[600] text-[16px] truncate"
            >
              <div className="text-[20px]">{Dashboard("#696F79")}</div>
              <span>Boshqaruv paneli</span>
            </button>
            <button
              onClick={() => navigate(`/user/course/${selectedCourse.id}`)}
              className="bg-primary w-full flex items-center gap-3 px-4 py-3 rounded-[10px] mt-2 text-white hover:bg-primary/90 transition-colors cursor-pointer"
              style={{ textAlign: 'left' }}
            >
              <FaBookOpen size={22} />
              <h1 className="font-semibold text-base truncate flex-1">
                {selectedCourse.name}
              </h1>
            </button>
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
              {filteredLessons.length > 0 ? (
                filteredLessons.map(renderLessonItem)
              ) : (
                <div className="text-sm text-gray-500 p-2">Darslar yo'q</div>
              )}
              </div>
          </>
        ) : (
          // Default View
          mainNavItems.map(
            (item) =>
              (!item.role || item.role === user?.role) && (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === "test") {
                      handleTestNavigation();
                    } else {
                      navigate(item.link);
                    }
                  }}
                  className={`${
                    item.locked 
                      ? "cursor-not-allowed opacity-60 bg-gray-100" 
                      : item.active
                        ? "bg-primary text-white"
                        : "hover:bg-[#e7e7e7] text-thin cursor-pointer"
                  } w-full flex justify-start items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 font-[600] text-[16px] truncate`}
                >
                  <div className="text-[20px] flex items-center gap-2">
                    {item.locked ? (
                      <>
                        <FaLock size={16} className="text-gray-400" />
                        {item.icon}
                      </>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <h1 className="flex items-center gap-2">
                    {item.title}
                    {item.locked && (
                      <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded">
                        Qulf
                      </span>
                    )}
                  </h1>
                </div>
              )
          )
        )}
      </div>
      
      {/* Footer */}
        <div className="flex flex-col items-center gap-3 mb-8 mt-auto px-4">
          <button
          onClick={() => navigate("/user/settings")}
            className="w-full flex items-center gap-2 justify-center py-2 mt-2 rounded-lg text-primary font-[600] hover:bg-[#f5f5ff] transition-all"
          >
            <FiSettings size={20} /> Mening ma'lumotlarim
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2 rounded-lg text-red-500 font-[600] hover:bg-red-50 transition-all"
          >
            <FiLogOut size={20} /> Chiqish
          </button>
        </div>
    </aside>
  );
};

export default Saidbar;

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