import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menu } from "../../image"; // Ensure the correct path for the menu image

const StaggeredDropDown = ({ navLink }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden flex items-center justify-center">
      <motion.div
        animate={open ? "open" : "closed"}
        className="relative z-[999]"
      >
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
            <Option key={idx} setOpen={setOpen} text={item.title} item={item} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

const Option = ({ text, item, setOpen }) => {
  const navigate = useNavigate();
  const handleActiveTab = (active) => {
    setOpen(false);
    navigate(active?.link);
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
