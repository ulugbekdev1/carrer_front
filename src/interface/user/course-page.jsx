import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  FaBookOpen,
  FaPlay,
  FaFileAlt,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import axios from "axios";

const baseUrl = "http://192.168.81.106:8000/api";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doneCourses } = useOutletContext() || {};
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const doneCourseInfo = useMemo(() => {
    return course
      ? doneCourses?.find((c) => c.course.id === course.id)
      : null;
  }, [course, doneCourses]);

  const points = useMemo(() => {
    return doneCourseInfo ? doneCourseInfo.points : 0;
  }, [doneCourseInfo]);

  const isCourseCompleted = doneCourseInfo && lessons.length > 0 && doneCourseInfo.points === lessons.length;

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      setLoading(true);
      try {
        const courseRes = await axios.get(`${baseUrl}/courses/${id}/`);
        setCourse(courseRes.data);
        const lessonsRes = await axios.get(`${baseUrl}/lessons/?course=${id}`);
        const filteredLessons = lessonsRes.data.filter(l => l.course?.toString() === id.toString());
        setLessons(filteredLessons);
      } catch (err) {
        console.error("Error fetching course data:", err);
        setCourse(null);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndLessons();
  }, [id]);

  // Kurs tugatilgan bo'lsa, done_course obyektini PATCH qilamiz
  useEffect(() => {
    if (!doneCourseInfo || lessons.length === 0) return;
    if (doneCourseInfo.points === lessons.length && !doneCourseInfo.end_course) {
      axios.patch(`${baseUrl}/done-courses/${doneCourseInfo.id}/`, {
        end_course: true
      }).catch(() => {});
    }
  }, [doneCourseInfo, lessons]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Yuklanmoqda...
      </div>
    );
  }
  if (!course) {
    return (
      <div className="text-center text-red-500 mt-10">Kurs topilmadi</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <FaBookOpen className="text-primary text-3xl" />
        <div>
          <h1 className="text-2xl font-bold text-primary">{course.name}</h1>
          <p className="text-gray-600">{course.info}</p>
        </div>
      </div>
      <div className="mb-8 flex gap-8 text-sm text-gray-500">
        <span>Darslar: <b>{lessons.length}</b></span>
        <span>Tugatildi: <b>{points} / {lessons.length}</b></span>
        {isCourseCompleted && (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg ml-4">
            <FaCheckCircle /> Kurs tugallangan
          </span>
        )}
      </div>
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaBookOpen className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>Bu kurs uchun hali darslar qo'shilmagan</p>
          </div>
        ) : (
          lessons.map((lesson, idx) => {
            const isCompleted = idx < points;
            const isLocked = idx > points;
            const lessonClasses =
              "bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4 transition-all duration-200 " +
              (isLocked
                ? "opacity-60 cursor-not-allowed bg-gray-50"
                : "hover:shadow-lg cursor-pointer group");

            return (
              <div
                key={lesson.id}
                onClick={() => !isLocked && navigate(`/user/lesson/${lesson.id}`)}
                className={lessonClasses}
                tabIndex={0}
                role="button"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary text-white font-bold rounded-lg mt-1">
                  {isCompleted ? (
                    <FaCheckCircle />
                  ) : isLocked ? (
                    <FaLock />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary">
                      {lesson.title}
                    </h3>
                    {lesson.video_url && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                        <FaPlay className="text-xs" /> Video
                      </span>
                    )}
                    {lesson.file_url && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">
                        <FaFileAlt className="text-xs" /> Fayl
                      </span>
                    )}
                  </div>
                  <div className="prose prose-sm text-gray-600 max-h-12 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CoursePage;