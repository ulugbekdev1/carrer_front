import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiServices } from "../../components/api.service";
import Loader1 from "../../components/loader/loader1";
import Timeline from "../landing-page/timeline";
import { FaArrowLeft, FaClipboardList, FaGraduationCap, FaBookOpen, FaChartLine, FaUsers, FaCertificate } from "react-icons/fa";

const CareerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [careerData, setCareerData] = useState(null);
  const [testCareer, setTestCareer] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const targetElement = document.body;
    window.scrollTo(0, 0);
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
    
    // Check if user is logged in
    const register = JSON.parse(localStorage.getItem("register") || "null");
    if (!register || !register.access) {
      setError("Siz tizimga kirmagansiz. Iltimos, avval tizimga kiring.");
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setError(null);
        
        // Fetch career data
        const res = await ApiServices.getData(`/careers/${id}/`);
        setCareerData(res);
        
        // Fetch tests data
        try {
          const test = await ApiServices.getData(`/tests/`);
          if (test && Array.isArray(test)) {
            const filterTest = test.filter((item) => item.careers_id === res.id);
            setTestCareer(filterTest);
          }
        } catch (testError) {
          console.log("Test fetch error:", testError);
          setTestCareer([]);
        }
        
        // Fetch roadmaps data and filter by career_id
        try {
          const roadmapsData = await ApiServices.getData(`/roadmaps/`);
          if (roadmapsData && Array.isArray(roadmapsData)) {
            const filteredRoadmaps = roadmapsData.filter(roadmap => roadmap.careers_id === res.id);
            setRoadmaps(filteredRoadmaps);
          }
        } catch (roadmapError) {
          console.log("Roadmap fetch error:", roadmapError);
          setRoadmaps([]);
        }
        
      } catch (error) {
        console.log("Career fetch error:", error);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="relative w-full h-full flex justify-center overflow-y-auto">
        <main className="relative w-full max-w-[1440px] mx-auto px-4">
          <div className="min-w-[400px] h-[400px] flex justify-center items-center">
            <Loader1 />
          </div>
        </main>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative w-full h-full flex justify-center overflow-y-auto">
        <main className="relative w-full max-w-[1440px] mx-auto px-4">
          <div className="mb-8">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors mb-6"
            >
              <FaArrowLeft size={16} />
              Bosh sahifaga qaytish
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Xatolik</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Tizimga kirish
              </button>
            </div>
          </div>
        </main>
      </main>
    );
  }

  return (
    <main className="relative w-full h-full flex justify-center overflow-y-auto">
      <main className="relative w-full max-w-[1440px] mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <FaArrowLeft size={16} />
            Orqaga qaytish
          </button>
        </div>

        {/* Career Header Section */}
        <div className="mb-12">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white p-8 mb-8">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <FaGraduationCap size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{careerData?.name}</h1>
                  <p className="text-lg opacity-90">Professional kasb yo'li</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed max-w-3xl">
                {careerData?.info}
              </p>
            </div>
          </div>

          {/* Career Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBookOpen className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{roadmaps.length}</h3>
                  <p className="text-gray-600">Modullar</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{testCareer.length}</h3>
                  <p className="text-gray-600">Testlar</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCertificate className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">1</h3>
                  <p className="text-gray-600">Sertifikat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tests Section */}
        {testCareer.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FaClipboardList className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Mavjud Testlar</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testCareer?.map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/user/test/${item.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <FaClipboardList className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Test #{idx + 1}</p>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                      <FaClipboardList size={16} />
                      <span>Testni boshlash</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmaps Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Kasb Yo'li va Modullar</h2>
          </div>
          
          {roadmaps.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <Timeline roadmaps={roadmaps} />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <FaChartLine className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Bu kasb uchun hali modullar qo'shilmagan</h3>
              <p className="text-gray-500 mb-6">Keyinroq qaytib keling va yangi modullarni ko'ring</p>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full"></div>
            </div>
          )}
        </section>
      </main>
    </main>
  );
};

export default CareerPage; 