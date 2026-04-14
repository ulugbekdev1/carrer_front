import React from "react";
import { logo, userDashboard, userNotification, userSupport } from "../../image";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Saidbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSubmitLink = (link) => {
    navigate(link);
  };
  const testId = localStorage.getItem("test_id");
  const userNavItems = [
    {
      id: 1,
      title: "Boshqaruv paneli",
      link: `/user/dashboard`,
      icon: Dashboard(
        pathname.split("/").includes("dashboard") ? "#fff" : "#696F79"
      ),
    },
    {
      id: 2,
      title: "Sertifikatlar",
      link: `/user/certificates`,
      icon: Certificates(
        pathname.split("/").includes("certificates") ? "#fff" : "#696F79"
      ),
    },
    {
      id: 3,
      title: "Test",
      link: `/user/test/${testId ? testId : "no"}`,
      icon: Test(pathname.split("/").includes("test") ? "#fff" : "#696F79"),
    },
    {
      id: 4,
      title: "Qo'llab-quvvatlash",
      link: `/user/support`,
      icon: Support(
        pathname.split("/").includes("support") ? "#fff" : "#696F79"
      ),
    },
  ];
  console.log(pathname);
  return (
    <div className="z-10 w-[25%] h-[100dvh] sticky top-0 left-0 px-[27px] pt-[43px] bg-primary rounded-r-[40px]">
      <NavLink to="/home" className="flex justify-start items-center gap-1">
          <img className="w-[34px] h-[34px]" src={logo} alt="Logo" />
          <h1 className="font-bold text-[40px] text-primary">Career AI</h1>
        </NavLink>
      <div className="flex flex-col gap-[20px] mt-[45px] justify-start items-start">
        {userNavItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleSubmitLink(item.link)}
            className={`${
              pathname === item.link && "bg-primary hover:bg-primary"
            } w-full hover:bg-[#e7e7e7] flex justify-start items-center gap-2 px-[20px] py-[12px] rounded-[12px] cursor-pointer`}
          >
            <div className="text-[20px]">{item.icon}</div>
            <h1
              className={`${
                pathname === item.link ? "text-white" : "text-thin"
              } text-[20px] font-[600] `}
            >
              {item.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saidbar;

function Dashboard(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
    >
      <path
        d="M6.375 18.875H2.20833C1.0625 18.875 0.125 17.9375 0.125 16.7917V2.20833C0.125 1.0625 1.0625 0.125 2.20833 0.125H6.375C7.52083 0.125 8.45833 1.0625 8.45833 2.20833V16.7917C8.45833 17.9375 7.52083 18.875 6.375 18.875ZM12.625 18.875H16.7917C17.9375 18.875 18.875 17.9375 18.875 16.7917V11.5833C18.875 10.4375 17.9375 9.5 16.7917 9.5H12.625C11.4792 9.5 10.5417 10.4375 10.5417 11.5833V16.7917C10.5417 17.9375 11.4792 18.875 12.625 18.875ZM18.875 5.33333V2.20833C18.875 1.0625 17.9375 0.125 16.7917 0.125H12.625C11.4792 0.125 10.5417 1.0625 10.5417 2.20833V5.33333C10.5417 6.47917 11.4792 7.41667 12.625 7.41667H16.7917C17.9375 7.41667 18.875 6.47917 18.875 5.33333Z"
        fill={color}
      />
    </svg>
  );
}
function Certificates(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill={color}
      viewBox="0 0 256 256"
    >
      <path d="M128,136a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h48A8,8,0,0,1,128,136Zm-8-40H72a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm112,65.47V224A8,8,0,0,1,220,231l-24-13.74L172,231A8,8,0,0,1,160,224V200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216a16,16,0,0,1,16,16V86.53a51.88,51.88,0,0,1,0,74.94ZM160,184V161.47A52,52,0,0,1,216,76V56H40V184Zm56-12a51.88,51.88,0,0,1-40,0v38.22l16-9.16a8,8,0,0,1,7.94,0l16,9.16Zm16-48a36,36,0,1,0-36,36A36,36,0,0,0,232,124Z"></path>
    </svg>
  );
}

function Test(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill={color}
      viewBox="0 0 256 256"
    >
      <path d="M216,40H40A16,16,0,0,0,24,56V216a8,8,0,0,0,11.58,7.16L64,208.94l28.42,14.22a8,8,0,0,0,7.16,0L128,208.94l28.42,14.22a8,8,0,0,0,7.16,0L192,208.94l28.42,14.22A8,8,0,0,0,232,216V56A16,16,0,0,0,216,40Zm0,163.06-20.42-10.22a8,8,0,0,0-7.16,0L160,207.06l-28.42-14.22a8,8,0,0,0-7.16,0L96,207.06,67.58,192.84a8,8,0,0,0-7.16,0L40,203.06V56H216ZM60.42,167.16a8,8,0,0,0,10.74-3.58L76.94,152h38.12l5.78,11.58a8,8,0,1,0,14.32-7.16l-32-64a8,8,0,0,0-14.32,0l-32,64A8,8,0,0,0,60.42,167.16ZM96,113.89,107.06,136H84.94ZM136,128a8,8,0,0,1,8-8h16V104a8,8,0,0,1,16,0v16h16a8,8,0,0,1,0,16H176v16a8,8,0,0,1-16,0V136H144A8,8,0,0,1,136,128Z"></path>
    </svg>
  );
}
function Support(color) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M11.5002 2.08337C5.75641 2.08337 1.0835 6.75629 1.0835 12.5V16.8157C1.0835 17.8823 2.01787 18.75 3.16683 18.75H4.2085C4.48476 18.75 4.74971 18.6403 4.94507 18.4449C5.14042 18.2496 5.25016 17.9846 5.25016 17.7084V12.3511C5.25016 12.0748 5.14042 11.8099 4.94507 11.6145C4.74971 11.4192 4.48476 11.3094 4.2085 11.3094H3.26266C3.84183 7.27817 7.31058 4.16671 11.5002 4.16671C15.6897 4.16671 19.1585 7.27817 19.7377 11.3094H18.7918C18.5156 11.3094 18.2506 11.4192 18.0553 11.6145C17.8599 11.8099 17.7502 12.0748 17.7502 12.3511V18.75C17.7502 19.899 16.8158 20.8334 15.6668 20.8334H13.5835V19.7917H9.41683V22.9167H15.6668C17.9647 22.9167 19.8335 21.048 19.8335 18.75C20.9825 18.75 21.9168 17.8823 21.9168 16.8157V12.5C21.9168 6.75629 17.2439 2.08337 11.5002 2.08337Z"
        fill={color}
      />
    </svg>
  );
}
