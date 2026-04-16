import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const baseUrl = "/api";

// Test user credentials
const TEST_USERS = [
  {
    email: "kursant@test.com",
    password: "test123",
    first_name: "Test",
    last_name: "Kursant",
    phone_number: "+998901234567",
    jobs: "Test job",
    interests: "Test interests",
    role: "kursant"
  },
  {
    email: "user@test.com",
    password: "test123",
    first_name: "Test",
    last_name: "User",
    phone_number: "+998901234568",
    jobs: "Test job",
    interests: "Test interests",
    role: "user"
  }
];

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    jobs: "...",
    interests: "...",
    certificate: null,
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const toastId = toast.loading("Roʻyxatdan oʻtish...");

    try {
      // Test user tekshirish
      const found = TEST_USERS.find(
        u => formData.email === u.email && formData.password === u.password
      );
      if (found) {
        localStorage.setItem("register", JSON.stringify(found));
        setLoading(false);
        toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!", { id: toastId });
        navigate("/home");
        return;
      }

      // Faqat kerakli maydonlarni yuborish
      const payload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        password: formData.password,
      };

      // Backend API so'rovi
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/user/register/`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      });

      if (response) {
        // Role mapping
        let mappedRole = response.data.role;
        if (mappedRole === 'cadet') mappedRole = 'kursant';
        else if (mappedRole === 'student') mappedRole = 'user';
        // User info olish (login.jsx dagi kabi)
        let userId = response.data.user_id || response.data.id;
        let access = response.data.access;
        let refresh = response.data.refresh;
        let userInfo = {};
        if (userId && access) {
          try {
            const userInfoRes = await axios.get(`${baseUrl}/user/${userId}/`, {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            });
            userInfo = userInfoRes.data;
          } catch (e) {
            // fallback: userInfo bo'lmasa, faqat response.data saqlanadi
            userInfo = {};
          }
        }
        // localStorage ga token, role, user info saqlash
        const userData = {
          ...userInfo,
          access: access,
          refresh: refresh,
          role: mappedRole,
          user_id: userId,
        };
        localStorage.setItem("register", JSON.stringify(userData));
        setLoading(false);
        toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!", { id: toastId });
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Tizimda xatolik. Iltimos qaytadan urunib ko'ring.");
      toast.error(
        "Ro'yxatdan o'tishda xatolik.Iltimos qaytadan urunib ko'ring.",
        { id: toastId }
      );
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-h-screen flex justify-center items-center py-[20px]"
    >
      <div className="sm:w-[578px] w-full sm:px-[118px] px-[20px] py-[40px] flex flex-col gap-4 sm:shadow-shadow6">
        <h1 className="text-black clamp2 font-[700] text-center">
          Ro'yxatdan o'tish
        </h1>
        <p className="text-black clamp3 font-[400] text-center">
          Ro'yxatdan o'tish uchun kirish ma'lumotlarni to'ldiring
        </p>
        <motion.h1
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: errorMessage ? 1 : 0,
            scale: errorMessage ? 1 : 0,
          }}
          className="text-[18px] font-[500] text-red-600"
        >
          {errorMessage}
        </motion.h1>
        <div className="flex flex-col gap-[24px] text-thin">
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              onChange={handleChange}
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="text"
              name="first_name"
              placeholder="Ism"
              required
            />
          </div>
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              name="last_name"
              onChange={handleChange}
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="text"
              placeholder="Familya"
              required
            />
          </div>
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              onChange={handleChange}
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="text"
              placeholder="+998 XX XXX XX XX"
              name="phone_number"
              required
            />
          </div>
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              onChange={handleChange}
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="email"
              placeholder="Email"
              name="email"
              required
            />
          </div>
          <div className="relative flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              onChange={handleChange}
              id="password"
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom pr-12"
              type={showPassword ? "text" : "password"}
              placeholder="Parol"
              name="password"
              required
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "opacity-[0.5]" : "opacity-1"
            } hover:bg-[#4a3affc7] transition-all duration-300 ease-linear py-[13px] rounded-[5px] bg-primary w-full clamp3 font-[500] text-white`}
          >
            {loading ? "Loading..." : "Ro'yxatdan o'tish"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-center w-full text-[16px] font-[400]"
          >
            Sizda account bormi? <strong>Tizimga kirish</strong>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Register;
