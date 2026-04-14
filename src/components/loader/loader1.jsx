import React from "react";
import "./loader.css";

const Loader1 = () => {
  return (
    <>
      <div className="loading">
        <div className="d1"></div>
        <div className="d2"></div>
      </div>
      <h1 className="text-[20px] font-[600] text-[#6c757d]">Loading...</h1>
    </>
  );
};

export default Loader1;
