import React from "react";
import { useNavigate } from "react-router-dom";
import { facebook, instagram, logo, telegram } from "../../image";

const Footer = () => {
  const navigate = useNavigate();
  const register = JSON.parse(localStorage.getItem("register") || "null");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <footer className="w-full bg-white flex flex-col gap-10 pt-10 md:pt-[120px]">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-[1440px] mx-auto w-11/12 gap-10 md:gap-6">
        <div>
          <a href="#home" className="flex justify-start items-center gap-1">
            <img className="w-[34px] h-[34px]" src={logo} alt="Logo" />
            <h1 className="font-[700] text-[24px] md:text-[32px] text-primary">
              Career AI
            </h1>
          </a>
          <h1 className="text-[12px] md:text-[14px] font-[500] text-thin mt-4">
            Biz bilan o'z sohangizdagi <br />
            darajangizni aniqlang
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-[15px] font-[700]">Bizning mijozlar</h1>
          <ul className="text-[15px] font-[400] opacity-[0.8]">
            <li>IT park</li>
            <li>Amazon</li>
            <li>AI company</li>
          </ul>
        </div>
        <div>
          <h1 className="text-[15px] font-[700]">Ijtimoiy tarmoqlarimiz</h1>
          <div className="flex gap-2 mt-4">
            <a href="#" className="p-2 rounded-[12px] bg-[#4A3AFF]">
              <img className="w-[24px] md:w-[32px]" src={facebook} alt="" />
            </a>
            <a href="#" className="p-2 rounded-[12px] bg-[#4A3AFF]">
              <img className="w-[24px] md:w-[32px]" src={instagram} alt="" />
            </a>
            <a href="#" className="p-2 rounded-[12px] bg-[#4A3AFF]">
              <img className="w-[24px] md:w-[32px]" src={telegram} alt="" />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start lg:items-end">
          {register ? (
            <button
              onClick={handleLogin}
              className="w-[150px] py-[11px] rounded-[10px] bg-primary text-[16px] font-[700] text-white"
            >
              Darajani aniqlash
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="w-[150px] py-[11px] rounded-[10px] bg-primary text-[16px] font-[700] text-white"
              >
                Ro'yxatdan o'tish
              </button>
              <button
                onClick={handleRegister}
                className="w-[150px] py-[11px] rounded-[10px] bg-white border-[1px] border-solid border-[#D4D2E3] text-[16px] font-[700] text-[#5D5A88]"
              >
                Tizimga kirish
              </button>
            </>
          )}
        </div>
      </section>
      <div className="max-w-[1440px] mx-auto w-full bg-[#4A3AFF80] h-[1px]"></div>
      <section className="max-w-[1440px] mx-auto w-11/12 mb-[40px]">
        <h1 className="text-[14px] md:text-[15px] font-[400] opacity-[0.8] text-black text-center">
          © R-24
        </h1>
      </section>
    </footer>
  );
};

export default Footer;
