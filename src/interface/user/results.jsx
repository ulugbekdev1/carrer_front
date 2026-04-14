import React, { useEffect, useState } from "react";
import { ApiServices } from "../../components/api.service";
import Loader1 from "../../components/loader/loader1";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaCalendarAlt, FaUser, FaClipboardList, FaEye, FaFilePdf } from "react-icons/fa";

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = JSON.parse(localStorage.getItem("register"));
        const res = await ApiServices.getData("/test-result/");
        const userResults = res.filter(result => 
          result.user?.id === user?.user_id || 
          result.user?.id === user?.id
        );
        setResults(userResults);
      } catch (error) {
        console.log("Error fetching results:", error);
        setError("Natijalarni yuklashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    
    const scriptId = 'html2pdf-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const uzbekMonths = [
        "yanvar", "fevral", "mart", "aprel", "may", "iyun",
        "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"
    ];

    // Tashkent vaqt zonasi uchun to'g'ri vaqt olish
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const tashkentOffset = 5 * 60 * 60000; // +05:00
    const tashkentDate = new Date(utc + tashkentOffset);

    const day = String(tashkentDate.getDate()).padStart(2, '0');
    const monthName = uzbekMonths[tashkentDate.getMonth()];
    const year = tashkentDate.getFullYear();
    const hours = String(tashkentDate.getHours()).padStart(2, '0');
    const minutes = String(tashkentDate.getMinutes()).padStart(2, '0');
    const seconds = String(tashkentDate.getSeconds()).padStart(2, '0');

    return `${day}-${monthName} ${year}-yil, ${hours}:${minutes}:${seconds}`;
};


  const handleViewAnalysis = (result) => {
    setSelectedResult(selectedResult?.id === result.id ? null : result);
  };

  const getTestTypeColor = (typeName) => {
    const colors = {
      'Test1_type': 'bg-blue-100 text-blue-800',
      'Test2_type': 'bg-green-100 text-green-800',
      'Test3_type': 'bg-purple-100 text-purple-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[typeName] || colors.default;
  };

  const downloadPDF = (result) => {
    if (typeof window.html2pdf === 'undefined') {
        alert("PDF yuklash uchun kutubxona hali yuklanmadi. Iltimos, bir ozdan so'ng qayta urinib ko'ring.");
        return;
    }
      
    const logoSvg = `<svg width="2406" height="2406" viewBox="0 0 2406 2406" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_229_366)"><path d="M0 515.4C0 196.5 258.5 -62 577.4 -62H1826.5C2145.5 -62 2404 196.5 2404 515.4V2343H577.4C258.5 2343 0 2084.5 0 1765.6V515.4Z" fill="#4A3AFF"/><path d="M1845.52 550.036C1746.52 378.564 1548.32 289.879 1354.86 330.792L1232.01 376.202L861.433 590.152C842.9 600.852 831.945 619.879 831.619 641.314L831.95 1038.92L1341.19 744.909L1341.24 744.996L1365.4 731.046L1714.17 932.329C1747.93 951.767 1777.84 976.903 1802.89 1006.35L1884.72 920.344C1925.26 796.946 1910.94 662.146 1845.52 550.036ZM1743.76 608.786L1742.94 608.566C1782.79 677.588 1797.27 757.676 1783.84 836.213C1781.55 834.648 1776.42 831.955 1773.06 829.737L1413.02 621.335C1394.82 610.6 1372.34 610.874 1353.81 621.574L931.795 865.224L931.668 686.203L1280.5 484.803C1442.49 391.167 1649.8 446.644 1743.76 608.786Z" fill="white"/><path d="M2133.8 1651.14C2232.8 1479.67 2210.51 1263.68 2078.34 1116.6L1977.59 1032.91L1607.02 818.957C1588.48 808.257 1566.53 808.284 1547.8 818.719L1203.64 1017.81L1712.87 1311.81L1712.82 1311.9L1736.98 1325.85L1737.05 1728.53C1737.1 1767.49 1730.29 1805.97 1717.31 1842.39L1832.71 1870.25C1959.84 1843.65 2069.42 1763.85 2133.8 1651.14ZM2032.04 1592.39L2031.82 1591.57C1991.97 1660.59 1929.86 1713.18 1855.13 1740.82C1855.34 1738.05 1855.1 1732.26 1855.35 1728.24L1855.81 1312.24C1856 1291.11 1844.53 1271.78 1825.99 1261.08L1403.98 1017.43L1558.95 927.808L1907.79 1129.21C2069.87 1222.67 2125.48 1429.95 2032.04 1592.39Z" fill="white"/><path d="M745.939 1897.89C844.939 2069.36 1043.13 2158.05 1236.6 2117.13L1359.45 2071.72L1730.02 1857.77C1748.56 1847.07 1759.51 1828.05 1759.84 1806.61L1759.51 1409.01L1250.27 1703.01L1250.22 1702.93L1226.06 1716.88L877.29 1515.6C843.528 1496.16 813.615 1471.02 788.563 1441.57L706.732 1527.58C666.201 1650.98 680.52 1785.78 745.939 1897.89ZM847.697 1839.14L848.517 1839.36C808.667 1770.34 794.182 1690.25 807.613 1611.71C809.902 1613.28 815.037 1615.97 818.396 1618.19L1178.43 1826.59C1196.64 1837.32 1219.11 1837.05 1237.65 1826.35L1659.66 1582.7L1659.79 1761.72L1310.95 1963.12C1148.97 2056.76 941.656 2001.28 847.697 1839.14Z" fill="white"/><path d="M458.654 775.783C359.655 947.256 381.949 1163.24 514.112 1310.33L614.866 1394.02L985.438 1607.97C1003.97 1618.67 1025.93 1618.64 1044.65 1608.21L1388.82 1409.12L879.585 1115.11L879.635 1115.02L855.473 1101.07L855.405 698.39C855.358 659.432 862.17 620.959 875.148 584.539L759.747 556.675C632.616 583.273 523.035 663.073 458.654 775.783ZM560.412 834.533L560.632 835.353C600.481 766.332 662.598 713.743 737.328 686.106C737.117 688.871 737.352 694.665 737.111 698.682L736.648 1114.68C736.454 1135.82 747.929 1155.15 766.462 1165.85L1188.48 1409.5L1033.5 1499.12L684.668 1297.72C522.585 1204.25 466.973 996.976 560.412 834.533Z" fill="white"/></g><defs><clipPath id="clip0_229_366"><rect width="2406" height="2406" fill="white"/></clipPath></defs></svg>`;
    const logoBase64 = `data:image/svg+xml;base64,${window.btoa(logoSvg)}`;
    
    const certificateHtml = `
      <div style="width: 8.27in; padding: 40px; background: #f4f7fc; font-family: 'Inter', sans-serif;">
        <div style="width: 100%; background: white; display: flex; flex-direction: column; border: 1px solid #e0e5ec; position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #4A3AFF 0%, #5e4dff 100%); color: white; padding: 40px; text-align: center; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Cg fill=\\'%23FFFFFF\\' fill-opacity=\\'0.05\\'%3E%3Crect x=\\'50\\' width=\\'50\\' height=\\'50\\' /%3E%3Crect y=\\'50\\' width=\\'50\\' height=\\'50\\' /%3E%3C/g%3E%3C/svg%3E'); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
                <img src="${logoBase64}" style="width: 70px; height: 70px; margin: 0 auto 20px;" alt="Logo" />
                <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Test Natijasi</h1>
                <p style="font-size: 18px; font-weight: 500; opacity: 0.9;">${result.test?.name}</p>
            </div>
          </div>
          <div style="padding: 40px; flex-grow: 1; display: flex; flex-direction: column;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-bottom: 30px;">
              <div style="background: #f8f9fc; border: 1px solid #eef1f6; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px;"><div style="width: 40px; height: 40px; background: #4A3AFF1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4A3AFF; font-size: 20px; flex-shrink: 0;">👤</div><div><div style="font-size: 12px; color: #6c757d; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Foydalanuvchi</div><div style="font-size: 15px; font-weight: 600; color: #343a40;">${result.user?.first_name} ${result.user?.last_name}</div></div></div>
              <div style="background: #f8f9fc; border: 1px solid #eef1f6; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px;"><div style="width: 40px; height: 40px; background: #4A3AFF1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4A3AFF; font-size: 20px; flex-shrink: 0;">📊</div><div><div style="font-size: 12px; color: #6c757d; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Test turi</div><div style="font-size: 15px; font-weight: 600; color: #343a40;">${result.test?.type?.name || "Noma'lum"}</div></div></div>
              <div style="background: #f8f9fc; border: 1px solid #eef1f6; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px;"><div style="width: 40px; height: 40px; background: #4A3AFF1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4A3AFF; font-size: 20px; flex-shrink: 0;">📅</div><div><div style="font-size: 12px; color: #6c757d; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Sana va vaqt</div><div style="font-size: 15px; font-weight: 600; color: #343a40;">${formatDate(result.created_at || result.updated_at)}</div></div></div>
              <div style="background: #f8f9fc; border: 1px solid #eef1f6; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 15px;"><div style="width: 40px; height: 40px; background: #4A3AFF1A; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4A3AFF; font-size: 20px; flex-shrink: 0;">❓</div><div><div style="font-size: 12px; color: #6c757d; font-weight: 500; text-transform: uppercase; margin-bottom: 4px;">Savollar soni</div><div style="font-size: 15px; font-weight: 600; color: #343a40;">${result.test?.type?.number_of_tests} ta</div></div></div>
            </div>
            <div style="background: #f8f9fc; border: 1px solid #eef1f6; border-radius: 15px; padding: 30px; flex-grow: 1;">
              <h2 style="font-size: 20px; font-weight: 600; color: #4A3AFF; margin-bottom: 20px; border-bottom: 2px solid #e0e5ec; padding-bottom: 15px;">AI Tahlili</h2>
              <div style="font-size: 14px; line-height: 1.7; color: #495057;">${result.ai_analysis?.replace(/\n/g, '<br>') || "Tahlil ma'lumotlari mavjud emas."}</div>
            </div>
          </div>
          <div style="padding: 20px 40px; text-align: center; border-top: 1px solid #eef1f6; background: #f8f9fc;">
            <p style="font-size: 13px; color: #6c757d;">Bu hujjat Career AI platformasi tomonidan avtomatik ravishda yaratildi.</p>
            <p style="font-size: 18px; font-weight: 700; color: #4A3AFF; margin-top: 8px;">Career AI</p>
          </div>
        </div>
      </div>
    `;
    
    const opt = {
      margin:       0,
      filename:     `Sertifikat - ${result.test.name}.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().from(certificateHtml).set(opt).save();
  };

  if (loading) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center py-6 px-2 bg-[#f7f8fa]">
        <Loader1 />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[40vh] flex flex-col items-center justify-center py-6 px-2 bg-[#f7f8fa]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Xatolik yuz berdi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Qaytadan urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[40vh] flex flex-col items-center justify-start py-6 px-2 bg-[#f7f8fa] results-container">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Test Natijalari</h1>
          <p className="text-gray-600">Barcha test natijalaringiz va tahlillari</p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hali test natijalari yo'q</h3>
            <p className="text-gray-600 mb-4">Test topshirganingizdan so'ng natijalar bu yerda ko'rinadi</p>
            <button
              onClick={() => navigate("/user/test/no")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Test topshirish
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result, idx) => (
              <div
                key={result.id || idx}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {result.test?.name || "Test"}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTestTypeColor(result.test?.type?.name)}`}>
                        {result.test?.type?.name || "Test turi"}
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FaChartLine className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span>{result.user?.first_name} {result.user?.last_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      <span>{formatDate(result.created_at || result.updated_at)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClipboardList className="w-4 h-4 mr-2" />
                      <span>{result.test?.type?.number_of_tests} ta savol</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewAnalysis(result)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      <FaEye className="w-4 h-4" />
                      {selectedResult?.id === result.id ? 'Tahlilni yashirish' : 'Tahlilni ko\'rish'}
                    </button>
                    <button
                      onClick={() => downloadPDF(result)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <FaFilePdf className="w-4 h-4" />
                      PDF yuklab olish
                    </button>
                  </div>
                </div>

                {/* Analysis Section - Expandable */}
                {selectedResult?.id === result.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="prose prose-gray max-w-none">
                      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">Test ma'lumotlari:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Test nomi:</span>
                            <p className="font-medium">{result.test?.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Test turi:</span>
                            <p className="font-medium">{result.test?.type?.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Savollar soni:</span>
                            <p className="font-medium">{result.test?.type?.number_of_tests}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Vaqt:</span>
                            <p className="font-medium">{result.test?.type?.time} daqiqa</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3 text-lg">AI Tahlili:</h4>
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: result.ai_analysis?.replace(/\n/g, '<br>') || "Tahlil ma'lumotlari mavjud emas."
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results; 