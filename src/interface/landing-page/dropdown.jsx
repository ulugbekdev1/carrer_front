import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menu } from "../../image"; // Ensure the correct path for the menu image

const StaggeredDropDown = ({ navLink }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const register = JSON.parse(localStorage.getItem("register"));

  return (
    <div className="flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-indigo-50"
        >
          <img src={menu} alt="menu" />
        </button>

        <motion.ul
          initial={false}
          animate={open ? "open" : "closed"}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[-70%] w-48 overflow-hidden"
        >
          {navLink.map((item, idx) => (
            <Option key={idx} setOpen={setOpen} text={item.name} item={item} />
          ))}
          {!register && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/register");
              }}
              className="bg-primary px-[14px] py-[8px] text-white text-[16px] font-[500] rounded-[12px]"
            >
              Ro'yxatdan o'tish
            </button>
          )}
        </motion.ul>
      </motion.div>
    </div>
  );
};

const Option = ({ text, item, setOpen }) => {
  const navigate = useNavigate();
  const handleActiveTab = (active) => {
    setOpen(false);
    if (active.id === 4) {
      navigate(active.link);
    } else {
      const element = document.getElementById(active.link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.li
      variants={itemVariants}
      onClick={() => handleActiveTab(item)}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <span className="text-[16px]">{text}</span>
    </motion.li>
  );
};

export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};
