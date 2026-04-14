import { useEffect } from "react";
import { backcontact } from "../../image";

const Contact = () => {
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  return (
    <main className="relative mt-[88px] pt-[40px] bg-[rgb(250,250,252)] pb-[175px] min-h-screen flex justify-center">
        <img className="max-sm:hidden max-w-[1440px] w-full h-[600px] absolute z-10 top-[88px] object-contain" src={backcontact} alt="" />
      <div className="z-20 w-[420px] flex flex-col gap-[24px] mt-[40px]">
        <h1 className="text-[35px] font-[700] text-black text-center">Biz bilan bog'lanish</h1>
        <p className="text-[20px] font-[400] text-black text-center">
        Biz bilan bog'lanish uchun quyidagi ma'lumotlarni to'ldiring
        </p>
        <form className="flex flex-col gap-[24px] text-thin px-[16px]" action="">
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="text"
              placeholder="Ismingiz"
            />
          </div>
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <input
              className="text-[16px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="email"
              placeholder="Emailingiz"
            />
          </div>
          <div className="flex flex-col item-start items-start justify-center gap-[6px]">
            <textarea
              className="text-[16px] h-[200px] font-[400] px-[14px] py-[10px] w-full rounded-[8px] border-border border-[1px] border-solid outline-none focus:shadow-custom"
              type="text"
              placeholder="Xabar qoldiring"
            />
          </div>
          <button  className="py-[13px] rounded-[5px] bg-primary w-full text-[18px] font-[500] text-white">
          Yuborish
        </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
