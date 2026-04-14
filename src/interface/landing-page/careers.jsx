import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiServices } from "../../components/api.service";
import Loader1 from "../../components/loader/loader1";
import Timeline from "./timeline";

const Careers = () => {
  const { id } = useParams();
  const [careerData, setCareerData] = useState(null);
  const [testCareer, setTestCareer] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetElement = document.body;
    window.scrollTo(0, 0);
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth",
    });
    
    const fetchData = async () => {
      try {
        const res = await ApiServices.getData(`/careers/${id}/`);
        const test = await ApiServices.getData(`/tests/`);
        const roadmaps = await ApiServices.getData(`/roadmaps/`);
        setRoadmaps(roadmaps);
        if (test) {
          const filterTest = test.filter((item) => item.careers_id === res.id);
          setTestCareer(filterTest);
        }
        setCareerData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="relative mt-[88px] pt-[40px] bg-[#FAFAFC] pb-[175px] min-h-screen">
        <section className="max-w-[1440px] mx-auto flex justify-start w-full items-center">
          <div className="min-w-[400px] h-[400px] flex justify-center items-center">
            <Loader1 />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mt-[88px] pt-[40px] bg-[#FAFAFC] pb-[175px] min-h-screen">
      <div className="max-w-[1440px] w-11/12 mx-auto">
        {/* Career Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            {careerData?.image && (
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                <img
                  src={careerData.image}
                  alt={careerData?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-4">
                {careerData?.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                {careerData?.info}
              </p>
            </div>
          </div>
        </div>

        {/* Tests Section */}
        {testCareer.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mavjud Testlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCareer.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Bu test orqali bilimingizni sinovdan o'tkazing
                  </p>
                  <div className="text-xs text-gray-500">
                    Test ID: {item.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Section */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Kasb Yo'li</h2>
          <Timeline roadmaps={roadmaps} />
        </section>

        {/* Call to Action */}
        <div className="text-center py-12 bg-gradient-to-r from-primary to-blue-600 rounded-2xl text-white">
          <h3 className="text-2xl font-bold mb-4">Bu kasbni o'rganishni xohlaysizmi?</h3>
          <p className="text-lg mb-6 opacity-90">
            Platformaga ro'yxatdan o'ting va testlarni yechishni boshlang
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Ro'yxatdan o'tish
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors">
              Kirish
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Careers;
