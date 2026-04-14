import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaBookOpen, FaCheckCircle, FaPlay, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useOutletContext, useNavigate } from "react-router-dom";

const baseUrl = "http://192.168.81.106:8000/api";

const Lessons = () => {
  const { onCourseSelect, selectedCourse, selectedLessons, doneCourses } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Kurslar ro'yxatini olish
  useEffect(() => {
    fetchCourses();
  }, []);

  // Tanlangan kurs uchun lessonlar olish
  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse.id);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("register") || "null");
      
      if (!user?.access) {
        toast.error("Siz tizimga kirmagansiz. Iltimos, avval tizimga kiring.");
        return;
      }
      
      const response = await axios.get(`${baseUrl}/courses/`, {
        timeout: 10000, // 10 soniya timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access}`,
        }
      });
      // API response strukturasiga mos ravishda map qilish
      const mappedCourses = response.data.map(course => ({
        id: course.id,
        title: course.name,
        description: course.info,
        image: course.image,
        lessons_count: 0, // API da yo'q bo'lsa default qiymat
        duration: 'N/A' // API da yo'q bo'lsa default qiymat
      }));
      setCourses(mappedCourses);
    } catch (error) {
      console.error("Kurslar yuklanmadi:", error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_TIMED_OUT') {
        toast.error("Server bilan bog'lanishda muammo. Test ma'lumotlari ko'rsatilmoqda.");
        // Test ma'lumotlari (backend ishlamayotganida)
        setCourses([
          {
            id: 1,
            title: "Axborot xavfsizligi",
            description: "Blue Team & Red Team",
            image: "https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Axborot+xavfsizligi",
            lessons_count: 5,
            duration: "2 oy"
          },
          {
            id: 2,
            title: "Web dasturlash",
            description: "Frontend va Backend asoslari",
            image: "https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Web+dasturlash",
            lessons_count: 8,
            duration: "3 oy"
          },
          {
            id: 3,
            title: "Mobile dasturlash",
            description: "Android va iOS dasturlash",
            image: "https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Mobile+dasturlash",
            lessons_count: 6,
            duration: "2.5 oy"
          }
        ]);
      } else {
        toast.error("Kurslar yuklanmadi");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      setCourseLoading(true);
      const user = JSON.parse(localStorage.getItem("register") || "null");
      
      if (!user?.access) {
        toast.error("Siz tizimga kirmagansiz. Iltimos, avval tizimga kiring.");
        return;
      }
      
      const response = await axios.get(`${baseUrl}/lessons/`, {
        timeout: 10000, // 10 soniya timeout
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access}`,
        }
      });
      // course bo'yicha filtrlash
      const filteredLessons = response.data.filter(lesson => lesson.course === courseId);
      setLessons(filteredLessons);
      
      // Sidebar'ga lessonlar ro'yxatini yuborish
      if (onCourseSelect) {
        onCourseSelect(selectedCourse, filteredLessons);
      }
    } catch (error) {
      console.error("Darslar yuklanmadi:", error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_TIMED_OUT') {
        toast.error("Server bilan bog'lanishda muammo. Test darslar ko'rsatilmoqda.");
        // Test lessonlar (backend ishlamayotganida)
        const testLessons = [
          {
            id: 1,
            title: "Dars 1: Kirish",
            content: "Bu darsda kurs haqida umumiy ma'lumot beriladi.",
            video_url: "https://example.com/video1.mp4",
            file_url: "https://example.com/file1.pdf",
            created_at: "2024-01-15T10:00:00Z",
            updated_at: "2024-01-15T10:00:00Z",
            course: courseId
          },
          {
            id: 2,
            title: "Dars 2: Asosiy tushunchalar",
            content: "Kursning asosiy tushunchalari va terminlarini o'rganamiz.",
            video_url: "https://example.com/video2.mp4",
            created_at: "2024-01-16T10:00:00Z",
            updated_at: "2024-01-16T10:00:00Z",
            course: courseId
          },
          {
            id: 3,
            title: "Dars 3: Amaliy mashg'ulot",
            content: "Amaliy mashg'ulotlar va misollar bilan ishlash.",
            file_url: "https://example.com/file3.pdf",
            created_at: "2024-01-17T10:00:00Z",
            updated_at: "2024-01-17T10:00:00Z",
            course: courseId
          }
        ];
        setLessons(testLessons);
        if (onCourseSelect) {
          onCourseSelect(selectedCourse, testLessons);
        }
      } else {
        toast.error("Darslar yuklanmadi");
      }
    } finally {
      setCourseLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    navigate(`/user/course/${course.id}`);
    if (onCourseSelect) {
      onCourseSelect(course, []);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  // Kurs tugatilganini aniqlash uchun
  const isCourseDone = useCallback(
    (courseId) => {
      const done = doneCourses?.find(dc => dc.course.id === courseId);
      return done && done.end_course === true;
    },
    [doneCourses]
  );

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return courses;
    }
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    // Main container, no extra div after .main
    <>
      {!selectedCourse ? (
        // Kurslar ro'yxati
        <div className="w-full mx-auto bg-white  p-6">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
            <FaBookOpen className="text-primary" /> Mavjud Kurslar
          </h1>
          
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Kurs nomini qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {filteredCourses.length} ta kurs topildi
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const done = isCourseDone(course.id);
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCourseSelect(course)}
                  className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border border-gray-100 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image || 'https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Course+Image'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Course+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Course Status Badge */}
                    <div className="absolute top-4 right-4">
                      {done ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
                          <FaCheckCircle size={14} />
                          <span>Tugatilgan</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-lg">
                          <FaBookOpen size={12} />
                          <span>Mavjud</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Course Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${done ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                        <span className="text-sm text-gray-200">
                          {done ? 'Muvaffaqiyatli tugatildi' : 'O\'rganish uchun tayyor'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Info */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                  
                    
                    {/* Action Button */}
                    <button
                      className={`w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                        done 
                          ? 'border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                          : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-primary'
                      }`}
                    >
                      {done ? (
                        <>
                          <FaCheckCircle size={16}/>
                          <span>Qayta ko'rish</span>
                        </>
                      ) : (
                        <>
                          <FaPlay size={16}/>
                          <span>Boshlash</span>
                        </>
                      )}
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 pointer-events-none ${
                    done ? 'group-hover:border-green-500/20' : 'group-hover:border-primary/20'
                  }`}></div>
                </motion.div>
              );
            })}
          </div>
          
          {/* No search results message */}
          {searchTerm && filteredCourses.length === 0 && courses.length > 0 && (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 mt-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Qidiruv natijasi topilmadi</h3>
              <p className="text-gray-500 mb-6">"{searchTerm}" bo'yicha kurslar topilmadi</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Barcha kurslarni ko'rish
              </button>
            </div>
          )}
        </div>
      ) : (
        // Tanlangan kurs uchun lessonlar
        <div className="w-full mx-auto bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => handleCourseSelect(null)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors font-semibold rounded-lg hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kurslar ro'yxatiga qaytish
            </button>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <FaBookOpen className="text-primary" /> {selectedCourse.title}
            </h1>
          </div>
          {courseLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {lessons.length === 0 ? (
                <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaBookOpen className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Bu kurs uchun hali darslar qo'shilmagan</h3>
                  <p className="text-gray-500 mb-6">Keyinroq qaytib keling va yangi darslarni ko'ring</p>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full"></div>
                </div>
              ) : (
                lessons.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/user/lesson/${lesson.id}`)}
                    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 cursor-pointer hover:-translate-y-1"
                    tabIndex={0}
                    role="button"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl text-lg shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex gap-1">
                            {lesson.video_url && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                                <FaPlay className="text-xs" /> Video
                              </span>
                            )}
                            {lesson.file_url && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                                <FaFileAlt className="text-xs" /> Fayl
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                          {lesson.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">
                            {formatDateTime(lesson.created_at)}
                          </span>
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                            <span>Darsni ko'rish</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Lessons; 