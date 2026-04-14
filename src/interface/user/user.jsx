import React, { useEffect, useState, useCallback, useRef } from "react";
import Saidbar from "./saidbar";
import Navbar from "./navbar";
import "./index.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://192.168.81.106:8000/api";

const User = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doneCourses, setDoneCourses] = useState([]);

  const user = JSON.parse(localStorage.getItem("register"));
  const lastFetchedPath = useRef("");

  // Fetch doneCourses from backend (real time, no localStorage)
  const fetchDoneCourses = useCallback(async () => {
    if (!user?.user_id) return;
    try {
      const res = await axios.get(`${baseUrl}/done-courses/?user_id=${user.user_id}`);
      // Frontendda ham user ID bo'yicha qo'shimcha filterlash
      const filteredData = res.data.filter(dc => dc.user && dc.user.id === user.user_id);
      setDoneCourses(filteredData);
    } catch (error) {
      console.error("Error fetching done courses:", error);
    }
  }, [user?.user_id]);

  // Only fetch doneCourses when entering a course or lesson page, and only once per such navigation
  useEffect(() => {
    const isCourseOrLesson =
      /\/user\/course\//.test(pathname) || /\/user\/lesson\//.test(pathname);
    if (isCourseOrLesson && lastFetchedPath.current !== pathname) {
      fetchDoneCourses();
      lastFetchedPath.current = pathname;
    }
    // Har safar /user/lessons sahifasiga o'tilganda doneCourses ni yangilash
    if (/\/user\/lessons$/.test(pathname)) {
      fetchDoneCourses();
    }
    // eslint-disable-next-line
  }, [pathname, fetchDoneCourses]);

  // Initial login check and redirect
  useEffect(() => {
    if (pathname === `/user`) {
      navigate(`/user/dashboard`);
    }
    if (!user) {
      navigate(`/login`);
    }
    // No fetchDoneCourses here!
    // eslint-disable-next-line
  }, []);

  // Sync sidebar state with URL
  useEffect(() => {
    const syncSidebarWithURL = async () => {
      const courseMatch = pathname.match(/\/user\/course\/(\d+)/);
      const lessonMatch = pathname.match(/\/user\/lesson\/(\d+)/);
      let courseId = null;

      if (courseMatch) {
        courseId = courseMatch[1];
      } else if (lessonMatch) {
        const lessonId = lessonMatch[1];
        const lesson = selectedLessons.find(l => l.id.toString() === lessonId);
        if (lesson && lesson.course) {
          courseId = lesson.course.toString();
        } else {
          try {
            const lessonRes = await axios.get(`${baseUrl}/lessons/${lessonId}/`);
            courseId = lessonRes.data?.course?.toString();
          } catch (err) {
            console.error("Error fetching lesson for course ID:", err);
            navigate('/user/dashboard');
            return;
          }
        }
      }

      if (!courseId) {
        if (selectedCourse !== null) {
          setSelectedCourse(null);
          setSelectedLessons([]);
        }
        return;
      }
      
      if (selectedCourse && selectedCourse.id.toString() === courseId) {
        return;
      }
      
      setLoading(true);
      try {
        const courseRes = await axios.get(`${baseUrl}/courses/${courseId}/`);
        const lessonsRes = await axios.get(`${baseUrl}/lessons/?course=${courseId}`);
        setSelectedCourse(courseRes.data);
        setSelectedLessons(lessonsRes.data);
      } catch (err) {
        console.error("Error fetching new course data:", err);
        setSelectedCourse(null);
        setSelectedLessons([]);
        navigate('/user/dashboard'); 
      } finally {
        setLoading(false);
      }
    };

    syncSidebarWithURL();
    // eslint-disable-next-line
  }, [pathname]);

  // Sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Course selection handler
  const handleCourseSelect = (course, lessons) => {
    setSelectedCourse(course);
    setSelectedLessons(lessons);
  };

  // Clear course selection
  const handleClearCourse = () => {
    setSelectedCourse(null);
    setSelectedLessons([]);
  };

  // After lesson completion, refresh doneCourses from backend and update localStorage
  const refreshDoneCourses = useCallback(async () => {
    await fetchDoneCourses();
  }, [fetchDoneCourses]);

  return (
    <main className="max-w-[1440px] mx-auto flex justify-start h-screen min-h-screen">
      <Saidbar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
        selectedCourse={selectedCourse}
        selectedLessons={selectedLessons}
        doneCourses={doneCourses}
        loading={loading}
      />
      <div className="w-full md:w-[75%] h-screen overflow-y-auto">
        <Navbar onSidebarToggle={handleSidebarToggle} />
        <div className="main md:p-2">
          <div className="relative rounded-[30px] md:shadow-shadow3 w-full h-full py-[12px] lg:py-[24px] px-[15px] lg:px-[40px] z-10">
            <Outlet
              context={{
                selectedCourse,
                selectedLessons,
                doneCourses,
                refreshDoneCourses,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default User;
