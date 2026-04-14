import React from 'react'
import { logouser } from '../../image'

const Navbar = () => {
  return (
    <nav className="bg-[#fff] px-4 w-full sticky top-0 left-0 h-[120px] flex justify-start items-center">
      <section className="w-full flex justify-between items-center">
      
        <div className="flex justify-start items-center gap-[50px]">
          <div className="flex justify-start items-center gap-[15px]">
            <img
              className="rounded-full w-[50px] h-[50px] object-cover"
              src={logouser}
              alt=""
            />
            <h1 className="text-[19px] font-[400] text-thin">Oybek</h1>
          </div>
        </div>
      </section>
    </nav>
  )
}

export default Navbar