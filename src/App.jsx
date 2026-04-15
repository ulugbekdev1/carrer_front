import React, { Suspense, lazy, useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/register/register";
import LandingPage from "./interface/landing-page/layout";
import Home from "./interface/landing-page/home";
import Login from "./components/login/login";
import Contact from "./interface/landing-page/contact";
import Loader from "./components/loader/loader";
import Careers from "./interface/landing-page/careers";
import axios from "axios";

const baseUrl = "/api";

//admin
const Admin = lazy(() => import("./interface/admin/admin"));
//moderator
const Moderator = lazy(() => import("./interface/moderator/moderator"));
//user
const User = lazy(() => import("./interface/user/user"));
const Dashboard = lazy(() => import("./interface/user/dashboard"));
const Results = lazy(() => import("./interface/user/results"));
const Test = lazy(() => import("./interface/user/test"));
const Support = lazy(() => import("./interface/user/support"));
const Settings = lazy(() => import("./interface/user/settings"));
const Lessons = lazy(() => import("./interface/user/lessons"));
const LessonPage = lazy(() => import("./interface/user/lesson-page"));
const CoursePage = lazy(() => import("./interface/user/course-page"));
const CareerPage = lazy(() => import("./interface/user/career-page"));

// Role-based route wrapper component
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("register"));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return children;
};

// Test route wrapper that checks if all courses are completed
const TestRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("register"));
  const [isAllCoursesCompleted, setIsAllCoursesCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCourseCompletion = async () => {
      // Students always have access to tests
      if (!user || user.role === 'student') {
        setIsAllCoursesCompleted(true);
        setLoading(false);
        return;
      }

      // Only check course completion for cadets
      if (user.role !== 'cadet') {
        setLoading(false);
        return;
      }

      try {
        // Fetch all courses and done courses
        const [coursesRes, doneCoursesRes] = await Promise.all([
          axios.get(`${baseUrl}/courses/`, {
            headers: {
              "accept": "application/json",
              "Authorization": `Bearer ${user.access}`,
            },
          }),
          axios.get(`${baseUrl}/done-courses/?user_id=${user.user_id}`)
        ]);

        const allCourses = coursesRes.data;
        const doneCourses = doneCoursesRes.data.filter(dc => dc.user && dc.user.id === user.user_id);
        const completedCourses = doneCourses.filter(dc => dc.end_course === true);

        setIsAllCoursesCompleted(completedCourses.length >= allCourses.length);
      } catch (error) {
        console.error("Error checking course completion:", error);
        setIsAllCoursesCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkCourseCompletion();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Students always have access to tests
  if (user.role === 'student') {
    return children;
  }

  // Only cadets need to complete courses
  if (user.role !== 'cadet') {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (loading) {
    return <Loader />;
  }

  if (!isAllCoursesCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Testlar qulfda</h2>
          <p className="text-gray-600 mb-6">
            Testlar bo'limiga kirish uchun barcha kurslarni tugatishingiz kerak!
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<LandingPage />}>
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers/:id" element={<Careers />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <Admin />
            </Suspense>
          }
        >
          <Route
            path="dashboard"
            element={<Suspense fallback={<h1>Loading...</h1>}></Suspense>}
          />
        </Route>
        <Route
          path="/moderator"
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <Moderator />
            </Suspense>
          }
        />
        <Route
          path="/user"
          element={
            <Suspense fallback={<Loader />}>
              <User />
            </Suspense>
          }
        >
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="results"
            element={
              <Suspense fallback={<Loader />}>
                <Results />
              </Suspense>
            }
          />
          <Route
            path="test/:id"
            element={
              <Suspense fallback={<Loader />}>
                <TestRoute>
                  <Test />
                </TestRoute>
              </Suspense>
            }
          />
          <Route
            path="support"
            element={
              <Suspense fallback={<Loader />}>
                <Support />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="career/:id"
            element={
              <Suspense fallback={<Loader />}>
                <RoleBasedRoute allowedRoles={['student']}>
                  <CareerPage />
                </RoleBasedRoute>
              </Suspense>
            }
          />
          <Route
            path="lessons"
            element={
              <Suspense fallback={<Loader />}>
                <RoleBasedRoute allowedRoles={['cadet']}>
                  <Lessons />
                </RoleBasedRoute>
              </Suspense>
            }
          />
          <Route
            path="lesson/:id"
            element={
              <Suspense fallback={<Loader />}>
                <RoleBasedRoute allowedRoles={['cadet']}>
                  <LessonPage />
                </RoleBasedRoute>
              </Suspense>
            }
          />
          <Route
            path="course/:id"
            element={
              <Suspense fallback={<Loader />}>
                <RoleBasedRoute allowedRoles={['cadet']}>
                  <CoursePage />
                </RoleBasedRoute>
              </Suspense>
            }
          />
        </Route>
        {/* Not found route - always last */}
        <Route
          path="*"
          element={
            (() => {
              const isLoggedIn = !!localStorage.getItem("register");
              return isLoggedIn ? <Navigate to="/user/dashboard" replace /> : <Navigate to="/home" replace />;
            })()
          }
        />
      </Routes>
    </main>
  );
};

export default App;
