import React, { useEffect, useState } from "react";
import axios from "axios";
import { ApiServices } from "../../components/api.service";
import Loader1 from "../../components/loader/loader1";
import { useNavigate } from "react-router-dom";

const Certificates = () => {
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState([]);

  // Fake sertifikatlar (namuna uchun)
  const exampleCertificates = [
    {
      thumbnail_url: "", // purposely empty to show icon
      pdf_url: "https://cert.amu.kz/files/instruction-cert-pdf.pdf",
      name: "AI Foundation Certificate",
      description: "Sun'iy intellekt asoslari bo'yicha muvaffaqiyatli yakunlangan kurs uchun beriladi.",
      date: "2024-05-01",
      course: "AI Fundamentals",
      cert_number: "AI-2024-0001"
    },
    {
      thumbnail_url: "", // purposely empty to show icon
      pdf_url: "https://cert.amu.kz/files/instruction-cert-pdf.pdf",
      name: "Career Orientation Certificate",
      description: "Kasb tanlash va shaxsiy rivojlanish bo'yicha kursni tugatganlik uchun.",
      date: "2024-04-15",
      course: "Career Guidance",
      cert_number: "CO-2024-0002"
    }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const register = JSON.parse(localStorage.getItem("register"));
    const fetchData = async () => {
      try {
        const res = await ApiServices.postData(`/pdf1`, {
          user_id: register.user_id,
        });
        setCertificate([...certificate, res]);
      } catch (error) {
        setCertificate(exampleCertificates);
      } finally {
        setLoading(false);
      }
    };
    if (register && register.user_id) {
      fetchData();
    } else {
      setCertificate(exampleCertificates);
      setLoading(false);
    }
  }, []);

  // PDF Icon SVG
  const PdfIcon = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#4A3AFF"/>
      <rect x="10" y="10" width="28" height="28" rx="4" fill="#fff"/>
      <text x="24" y="34" textAnchor="middle" fontSize="16" fill="#4A3AFF" fontWeight="bold" fontFamily="Arial">PDF</text>
    </svg>
  );

  return (
    <div className="w-full min-h-[40vh] flex flex-col items-center justify-start py-6 px-2 bg-[#f7f8fa]">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Mening Sertifikatlarim</h1>
      {loading ? (
        <div className="min-w-[100px] md:min-w[400px] h-full flex justify-center items-center">
          <Loader1 />
        </div>
      ) : certificate.length === 0 ? (
        <div className="text-center text-gray-500 text-base">Sizda hali sertifikatlar mavjud emas.</div>
      ) : (
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificate.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow border border-[#e5e7eb] flex flex-row items-center gap-3 p-3 min-h-[120px] hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-center w-20 h-24 bg-[#f3f4f6] rounded-lg">
                {item?.thumbnail_url ? (
                  <img
                    className="object-cover w-16 h-20 rounded border"
                    src={item.thumbnail_url}
                    alt="PDF Thumbnail"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <PdfIcon />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-base font-semibold text-primary mb-1 leading-tight">{item.name || "Sertifikat nomi"}</h2>
                  <p className="text-gray-700 text-xs mb-1 line-clamp-2">{item.description || "Sertifikat tavsifi"}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                    <span><b>Kurs:</b> {item.course || "-"}</span>
                    <span><b>Sana:</b> {item.date || "-"}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <b>Raqam:</b> {item.cert_number || "-"}
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <a
                    href={item?.pdf_url || "#"}
                    className="py-1 px-4 bg-primary hover:bg-[#372fd6] text-white font-medium rounded text-xs shadow transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    Yuklab olish
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
