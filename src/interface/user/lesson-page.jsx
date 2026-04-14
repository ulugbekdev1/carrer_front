import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { FaPlay, FaFileAlt, FaArrowLeft, FaDownload } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const baseUrl = "http://192.168.81.106:8000/api";

const LessonPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [lessonJustCompleted, setLessonJustCompleted] = useState(false);
  const [courseLessons, setCourseLessons] = useState([]);
  const navigate = useNavigate();
  const {
    selectedCourse,
    selectedLessons,
    doneCourses,
    refreshDoneCourses,
  } = useOutletContext() || {};
  
  const user = JSON.parse(localStorage.getItem("register"));

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}/lessons/${id}/`)
      .then(res => {
        setLesson(res.data);
        axios.get(`${baseUrl}/lessons/?course=${res.data.course}`)
          .then(lessonsRes => {
            setCourseLessons(lessonsRes.data);
          })
          .catch(() => setCourseLessons([]));
      })
      .catch(err => {
        setLesson(null);
        toast.error("Darsni yuklashda xatolik");
      })
      .finally(() => setLoading(false));
    setLessonJustCompleted(false);
  }, [id]);

  const sortedLessons = useMemo(() => {
    return [...courseLessons].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [courseLessons]);

  const doneCourseInfo = useMemo(() => {
    if (!lesson || !doneCourses) return null;
    return doneCourses.find((c) => c.course.id === lesson.course);
  }, [lesson, doneCourses]);

  const { points, isLessonCompletable, isLessonCompleted, lessonIndex } = useMemo(() => {
    if (!lesson || !doneCourses) return {};
    const points = doneCourseInfo ? doneCourseInfo.points : 0;
    const lessonIndex = sortedLessons.findIndex(l => l.id.toString() === id);
    return {
      points,
      isLessonCompletable: lessonIndex === points,
      isLessonCompleted: lessonIndex < points,
      lessonIndex,
    };
  }, [lesson, doneCourses, id, sortedLessons]);
  
  const isCourseCompleted = doneCourseInfo?.end_course === true;

  const handleCompleteLesson = async () => {
    if (!window.confirm("Rostdan ham darsni tugatganingizni tasdiqlaysizmi?")) {
      return;
    }
    setIsCompleting(true);
    const toastId = toast.loading("Bajarilmoqda...");
    const newPoints = points + 1;
    const isLastLesson = sortedLessons.length > 0 ? newPoints === sortedLessons.length : false;

    try {
      if (doneCourseInfo) {
        await axios.patch(`${baseUrl}/done-courses/${doneCourseInfo.id}/`, {
          points: newPoints,
          end_course: isLastLesson,
          course_id: lesson.course,
          user_id: user.user_id,
        });
      } else {
        await axios.post(`${baseUrl}/done-courses/`, {
          course_id: lesson.course,
          user_id: user.user_id,
          points: newPoints,
          end_course: isLastLesson,
        });
      }
      toast.success("Muvaffaqiyatli yakunlandi!", { id: toastId });
      setLessonJustCompleted(true);
      await refreshDoneCourses();
      if (isLastLesson) {
        navigate(`/user/course/${lesson.course}`);
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast.error("Xatolik yuz berdi.", { id: toastId });
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Yuklanmoqda...</div>;
  if (!lesson) return <div className="text-center text-red-500 p-8">Dars topilmadi.</div>;
  
  const fileName = lesson.file_url ? lesson.file_url.split('/').pop() : null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/user/course/${lesson.course}`)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <FaArrowLeft size={16} />
          <span>Kursga qaytish</span>
        </button>
      </div>

      {/* Video Player */}
      {lesson.video_url && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <video key={lesson.id} className="w-full" controls autoPlay muted>
            <source src={lesson.video_url} type="video/mp4" />
            Brauzeringiz video tegini qo'llab-quvvatlamaydi.
          </video>
        </div>
      )}

      {/* Title & File Download */}
      <h1 className="text-3xl font-bold text-primary mb-4">{lesson.title}</h1>
      
      {lesson.file_url && (
        <a
          href={lesson.file_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <FaDownload />
          <span>{fileName || "Faylni yuklash"}</span>
        </a>
      )}

      {/* HTML Content */}
      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
      
      {/* Completion Button */}
      {!isLessonCompleted && !lessonJustCompleted && !isCourseCompleted && (
        <div className="mt-8 pt-6 border-t flex justify-end">
          <button
            onClick={handleCompleteLesson}
            disabled={isCompleting}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-wait"
          >
            {isCompleting ? "Bajarilmoqda..." : "Darsni yakunlash"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonPage; 