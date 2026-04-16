import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import axios from "axios";
import { FaPlay, FaRedo, FaBook, FaCheckCircle, FaGraduationCap } from "react-icons/fa";

const baseUrl = "/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { doneCourses, onClearCourse, refreshDoneCourses } = useOutletContext() || {};
  
  const [courses, setCourses] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("register"));
    setUser(userData);
  }, []);

  useEffect(() => {
    if (onClearCourse) {
      onClearCourse();
    }
  }, [onClearCourse]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        if (refreshDoneCourses) {
          await refreshDoneCourses();
        }

        if (user?.role === 'student') {
          // Student users only fetch careers
          const careersRes = await axios.get(`${baseUrl}/careers/`, {
            headers: {
              "accept": "application/json",
              "Authorization": `Bearer ${user.access}`,
            },
          });
          setCareers(careersRes.data);
        } else {
          // Cadet users fetch courses and lessons
          const [coursesRes, lessonsRes] = await Promise.all([
            axios.get(`${baseUrl}/courses/`, {
              headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${user.access}`,
              },
            }),
            axios.get(`${baseUrl}/lessons/`, {
              headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${user.access}`,
              },
            }),
          ]);
          setCourses(coursesRes.data);
          setAllLessons(lessonsRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  const userCourses = useMemo(() => {
    if (!doneCourses || courses.length === 0 || allLessons.length === 0) {
      return [];
    }
    
    return doneCourses.map(dc => {
      const courseInfo = courses.find(c => c.id === dc.course.id);
      if (!courseInfo) return null;

      const lessonsForCourse = allLessons
        .filter(l => l.course === dc.course.id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        
      const totalLessons = lessonsForCourse.length;
      const progress = totalLessons > 0 ? (dc.points / totalLessons) * 100 : 0;
      
      const isCompleted = totalLessons > 0 && dc.points === totalLessons;
      const nextLesson = isCompleted ? null : lessonsForCourse[dc.points];

      return {
        ...courseInfo,
        name: courseInfo.name,
        info: courseInfo.info,
        points: dc.points,
        totalLessons,
        progress,
        isCompleted,
        nextLessonId: nextLesson?.id
      };
    }).filter(Boolean);
  }, [doneCourses, courses, allLessons]);

  // Filter careers based on search term
  const filteredCareers = useMemo(() => {
    if (!searchTerm.trim()) {
      return careers;
    }
    return careers.filter(career => 
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.info.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [careers, searchTerm]);

  const timelineSteps = [
    { name: "Kursni tanlash", head: "O'zingizga mos yo'nalishdagi kursni tanlang." },
    { name: "Kursni tugatish", head: "Barcha darslarni muvaffaqiyatli yakunlang." },
    { name: "Testdan o'tish", head: "Bilimingizni sinovdan o'tkazish uchun test topshiring." },
    { name: "Natijani olish", head: "Yakuniy natija va sertifikatni qo'lga kiriting." },
  ];

  const studentTimelineSteps = [
    { name: "Kasbni tanlash", head: "O'zingizga mos yo'nalishdagi kasbni tanlang." },
    { name: "Kasb yo'lini ko'rish", head: "Tanlangan kasbning rivojlanish yo'lini o'rganing." },
    { name: "Test yechish", head: "Bilimingizni sinovdan o'tkazish uchun test topshiring." },
    { name: "Natijali sertifikat olish", head: "Yakuniy natija va sertifikatni qo'lga kiriting." },
  ];
  
  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
  }

  // Student dashboard - show careers
  if (user?.role === 'student') {
    return (
      <main className="relative w-full h-full flex justify-center overflow-y-auto">
        <main className="relative w-full max-w-[1440px] mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kasblar</h2>
            
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Kasb nomini qidirish..."
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
                <p className="text-sm text-gray-500 mt-2">
                  {filteredCareers.length} ta kasb topildi
                </p>
              )}
            </div>

            {careers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCareers.map(career => (
                  <div key={career.id} className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border border-gray-100 hover:-translate-y-2">
                    {/* Career Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={career.image}
                        alt={career.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Career+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Career Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {career.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-200">Mavjud</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Career Info */}
                    <div className="p-6">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {career.info}
                      </p>
                      
                      {/* Action Button */}
                      <button
                        onClick={() => navigate(`/user/career/${career.id}`)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaGraduationCap size={16}/>
                        <span>Kasbni o'rganish</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaGraduationCap className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Hozirda mavjud kasblar yo'q</h3>
                <p className="text-gray-500 mb-6">Keyinroq qaytib keling va yangi kasblarni ko'ring</p>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full"></div>
              </div>
            )}

            {/* No search results message */}
            {searchTerm && filteredCareers.length === 0 && careers.length > 0 && (
              <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Qidiruv natijasi topilmadi</h3>
                <p className="text-gray-500 mb-6">"{searchTerm}" bo'yicha kasblar topilmadi</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Barcha kasblarni ko'rish
                </button>
              </div>
            )}
          </div>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Platformadan Foydalanish Yo'li</h2>
            <Timeline roadmaps={studentTimelineSteps} />
          </section>
        </main>
      </main>
    );
  }

  // Cadet dashboard - show courses (existing functionality)
  return (
    <main className="relative w-full h-full flex justify-center overflow-y-auto">
      <main className="relative w-full max-w-[1440px] mx-auto px-4">
    
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mening Kurslarim</h2>
          {userCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map(course => {
                const isCompleted = course.isCompleted;
                
                return (
                  <div key={course.id} className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border border-gray-100 hover:-translate-y-2">
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image || 'https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Course+Image'}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200/4A3AFF/FFFFFF?text=Course+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Course Status Overlay */}
                      <div className="absolute top-4 right-4">
                        {isCompleted ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                            <FaCheckCircle size={14} />
                            <span>Tugatilgan</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                            <FaPlay size={12} />
                            <span>Davom etmoqda</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Course Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                          <span className="text-sm text-gray-200">
                            {isCompleted ? 'Muvaffaqiyatli tugatildi' : 'O\'qilmoqda'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Course Info */}
                    <div className="p-6">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {course.info}
                      </p>
                      
                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-sm font-semibold ${isCompleted ? 'text-green-700' : 'text-primary'}`}>
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-gray-500">
                            {course.points} / {course.totalLessons}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <button
                        onClick={() => navigate(isCompleted ? `/user/course/${course.id}` : (course.nextLessonId ? `/user/lesson/${course.nextLessonId}` : `/user/course/${course.id}`))}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                          isCompleted 
                            ? 'border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white' 
                            : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-blue-600 hover:to-primary'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <FaRedo size={16}/>
                            <span>Qayta ko'rish</span>
                          </>
                        ) : (
                          <>
                            <FaPlay size={16}/>
                            <span>Davom etish</span>
                          </>
                        )}
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className={`absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 pointer-events-none ${
                      isCompleted ? 'group-hover:border-green-500/20' : 'group-hover:border-primary/20'
                    }`}></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <FaBook className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Siz hali birorta kursni boshlamagansiz</h3>
              <p className="text-gray-500 mb-6">O'rganishni boshlash uchun kurslar sahifasiga o'ting.</p>
              <button 
                onClick={() => navigate('/user/lessons')}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Kurslarni ko'rish
              </button>
            </div>
          )}
        </div>
        
        <section className="mb-10">
           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Platformadan Foydalanish Yo'li</h2>
          <Timeline roadmaps={timelineSteps} />
        </section>
      </main>
    </main>
  );
};

export default Dashboard;

const Timeline = ({ roadmaps }) => {
  return (
    <VerticalTimeline>
      {roadmaps.map((item, idx) => (
        <VerticalTimelineElement
          key={idx}
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#4A3AFF", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #4A3AFF" }}
          date={`Bosqich ${idx + 1}`}
          iconStyle={{ background: "#4A3AFF", color: "#fff", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          icon={<span>{idx + 1}</span>}
        >
          <h3 className="vertical-timeline-element-title font-bold">{item?.name}</h3>
          <p>{item?.head}</p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
};
