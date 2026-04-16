import React, { useEffect, useState } from "react";
import { careers1, careers2, careers3, landingBack } from "../../image";
import { ApiServices } from "../../components/api.service";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const baseUrl = "/api";

const Home = () => {
  const navigate = useNavigate();
  const [careersData, setCareersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const register = JSON.parse(localStorage.getItem("register"));

  // Example careers for fallback
  const exampleCareers = [
    {
      id: 1,
      name: "Matematika",
      info: "Kirish darsi, 3-5 modul, yakuniy test",
      image: careers1,
      bgColor: "#DBEDF5",
      textColor: "#1D4645"
    },
    {
      id: 2,
      name: "Fizika",
      info: "Kirish darsi, 3-5 modul, yakuniy test",
      image: careers2,
      bgColor: "#102F2E",
      textColor: "#FFFFFF"
    },
    {
      id: 3,
      name: "Kimyo",
      info: "Kirish darsi, 3-5 modul, yakuniy test",
      image: careers3,
      bgColor: "#FEF1E2",
      textColor: "#1D4645"
    }
  ];

  useEffect(() => {
    const register = JSON.parse(localStorage.getItem("register"));
    
    // Only redirect if user is admin or moderator, not for regular users
    if (register?.role === "admin") {
      navigate(`/admin/dashboard`);
      return;
    } else if (register?.role === "moderator") {
      navigate(`/moderator/dashboard`);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching careers from API...");
        
        const res = await axios({
          method: "GET",
          url: `${baseUrl}/careers/`,
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        console.log("API Response:", res?.data);
        console.log("API Response type:", typeof res?.data);
        console.log("API Careers length:", Array.isArray(res?.data) ? res?.data?.length : 'Not an array');
        
        // If API has careers, use them. Otherwise use examples
        const apiCareers = Array.isArray(res?.data) ? res?.data : [];
        let finalCareers;
        
        console.log("Processed API careers:", apiCareers);
        console.log("API careers count:", apiCareers.length);
        
        if (apiCareers.length > 0) {
          console.log("Using API careers");
          // Use all careers from API
          finalCareers = apiCareers.map((career, index) => {
            console.log("Processing career:", career);
            return {
              id: career.id,
              name: career.name,
              info: career.info || "Kirish darsi, 3-5 modul, yakuniy test",
              image: career.image || [careers1, careers2, careers3][index % 3],
              bgColor: ["#DBEDF5", "#102F2E", "#FEF1E2", "#E8F5E8", "#FFF2E6", "#F0E6FF"][index % 6],
              textColor: (index % 6) === 1 ? "#FFFFFF" : "#1D4645"
            };
          });
        } else {
          console.log("Using example careers (no API careers found)");
          // Use example careers if API has no careers
          finalCareers = exampleCareers;
        }
        
        console.log("Final careers to display:", finalCareers);
        setCareersData(finalCareers);
      } catch (error) {
        console.log("API Error:", error);
        console.log("Using example careers due to API error");
        // Use example careers if API fails
        setCareersData(exampleCareers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // Empty dependency array to run only once

  return (
    <div>
      <header id="home" className="mt-[88px] bg-[#FAFAFC] pb-[175px]">
        <section className="max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 w-10/12 mx-auto pt-[116px]">
          <div className="flex flex-col justify-center items-start">
            <h1 className="clamphead font-[700] text-primary">
            Kursantlar va O'quvchilar uchun yo'nalish platformasi
            </h1>
            <ul className="list-disc ml-[16px] clamp4 text-thin">
              <li>
                Kursantlar uchun to'liq kurslar va AI tahlil
              </li>
              <li>O'quvchilar uchun qiziqish asosida test va yo'nalish tavsiyalari</li>
              <li>8 ta yo'nalish bo'yicha aniq natijalar</li>
              <li>Shaxsiy sertifikat va natijalarni yuklab olish</li>
            </ul>
            {!register ? (
              <button
                onClick={() => navigate("/register")}
                className="mt-[60px] px-[24px] py-[18px] rounded-[10px] bg-primary text-[16px] font-[700] text-white"
              >
                Ro'yxatdan o'tish
              </button>
            ) : (
              <button
                onClick={() => navigate("/careers/1")}
                className="mt-[60px] px-[24px] py-[18px] rounded-[10px] bg-primary clamp4 font-[700] text-white"
              >
                Testdan o'tish
              </button>
            )}
          </div>
          <div>
            <img src={landingBack} alt="Platforma rasmi" />
          </div>
        </section>

        <section id="courses" className="bg-primary w-full mt-[180px] py-8">
          <div className="relative mx-auto max-w-[1440px] w-11/12 h-full">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Asosiy Kurslar</h2>
            <div className="relative w-full flex flex-col lg:flex-row justify-between gap-6 lg:gap-3">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="cursor-pointer mt-[20px] lg:mt-[50px] w-full lg:w-[370px] h-auto lg:h-[416px] shadow-shadow1 bg-gray-200 p-6 lg:p-[48px] rounded-[4px] flex flex-col justify-between animate-pulse">
                    <div className="flex justify-center lg:justify-end">
                      <div className="w-[150px] lg:w-[206px] h-[150px] lg:h-[206px] bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                ))
              ) : (
                careersData.map((career, index) => (
                  <div
                    key={career.id}
                    className="group mt-[20px] lg:mt-[50px] w-full lg:w-[370px] h-auto lg:h-[416px] shadow-shadow1 hover:shadow-2xl transition-all duration-300 p-6 lg:p-[48px] rounded-[4px] flex flex-col justify-between relative overflow-hidden"
                    style={{ backgroundColor: career.bgColor }}
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    
                    <div className="flex justify-center lg:justify-end relative z-10">
                      <img
                        className="w-[150px] lg:w-[206px] h-[150px] lg:h-[206px] object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        src={career.image}
                        alt={career.name}
                        onError={(e) => {
                          e.target.src = [careers1, careers2, careers3][index % 3];
                        }}
                      />
                    </div>
                    <div className="relative z-10">
                      <h1 
                        className="text-[24px] lg:text-[40px] font-[700] text-center lg:text-right mb-4 group-hover:scale-105 transition-transform duration-300"
                        style={{ color: career.textColor }}
                      >
                        {career.name}
                      </h1>
                      <p 
                        className="text-[16px] mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        style={{ color: career.textColor }}
                      >
                        {career.info}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-white">
          <div className="flex justify-center items-center mx-auto max-w-[1440px] py-20 bg-white max-md:px-5">
            <div className="flex flex-col mt-16 w-full max-w-[1176px] max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-5 font-bold text-teal-900 max-md:flex-wrap max-md:max-w-full">
                <div className="flex-auto clamp1 leading-[64.02px] max-md:max-w-full max-md:text-4xl">
                  Platforma Imkoniyatlari
                </div>
              </div>
              <div className="mt-20 max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                  <div className="flex flex-col w-[41%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col max-md:mt-8 max-md:max-w-full">
                      <div className="flex flex-col items-start pt-11 pr-20 pb-20 pl-8 bg-orange-50 rounded max-md:px-5 max-md:max-w-full">
                        <img
                          loading="lazy"
                          srcSet={landingBack}
                          alt="AI Tahlil"
                          className="ml-3 rounded-full aspect-[1.04] w-[76px] max-md:ml-2.5"
                        />
                        <div className="mt-9 text-2xl font-bold leading-8 text-teal-900">
                          AI Tahlil
                        </div>
                        <div className="mt-8 mb-2.5 text-base leading-8 text-zinc-800 text-opacity-50">
                          8 ta yo'nalish bo'yicha aniq natijalar va tavsiyalar
                        </div>
                      </div>
                      <div className="flex flex-col self-end px-12 pt-8 pb-14 mt-8 max-w-full bg-white rounded shadow-2xl w-[272px] max-md:px-5">
                        <div className="shrink-0 bg-orange-50 rounded-full h-[98px] w-[98px]" />
                        <div className="mt-6 text-2xl font-bold leading-8 text-teal-900">
                          Sertifikatlar
                        </div>
                        <div className="mt-9 text-base leading-8 text-zinc-800 text-opacity-50">
                          Shaxsiy sertifikat va natijalarni yuklab olish
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col ml-5 w-[59%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow mt-24 max-md:mt-10 max-md:max-w-full">
                      <div className="flex flex-col items-start pt-10 pr-20 pb-20 pl-8 max-w-full bg-orange-50 rounded w-[374px] max-md:px-5">
                        <img
                          loading="lazy"
                          srcSet={landingBack}
                          alt="Testlar"
                          className="ml-3 rounded-full aspect-[1.04] w-[78px] max-md:ml-2.5"
                        />
                        <div className="mt-8 text-2xl font-bold leading-8 text-teal-900">
                          Testlar
                        </div>
                        <div className="mt-8 mb-2.5 text-base leading-8 text-zinc-800 text-opacity-50">
                          Kursantlar va o'quvchilar uchun maxsus testlar
                        </div>
                      </div>
                      <div className="mt-8 max-md:max-w-full">
                        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                          <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col px-8 py-12 w-full bg-orange-50 rounded max-md:px-5 max-md:mt-8">
                              <img
                                loading="lazy"
                                srcSet={landingBack}
                                alt="Monitoring"
                                className="ml-3 rounded-full aspect-[1.04] w-[75px] max-md:ml-2.5"
                              />
                              <div className="mt-10 text-2xl font-bold leading-8 text-teal-900">
                                Monitoring
                              </div>
                              <div className="mt-7 text-base leading-8 text-zinc-800 text-opacity-50">
                                Natijalarni kuzatish va tahlil qilish
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col grow items-start py-12 pr-20 pl-8 w-full bg-white rounded shadow-2xl max-md:px-5 max-md:mt-8">
                              <img
                                loading="lazy"
                                srcSet={landingBack}
                                alt="Bayram Rejimi"
                                className="ml-3.5 rounded-full aspect-[1.04] w-[72px] max-md:ml-2.5"
                              />
                              <div className="mt-10 text-2xl font-bold leading-8 text-teal-900">
                                Bayram Rejimi
                              </div>
                              <div className="mt-7 text-base leading-8 text-zinc-800 text-opacity-50">
                                Bayram kunlarida barcha testlar bepul
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>
    </div>
  );
};

export default Home;
