import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Moderator = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === `/moderator`) {
      navigate(`/moderator/dashboard`);
    }
    const register = JSON.parse(localStorage.getItem("register"));
    if (register) {
      if (register.role === "user") {
        navigate("/home");
      } else {
        navigate(`/${register.role}/dashboard`);
      }
      return;
    }
    navigate(`/login`);
  }, []);
  return (
    <div>Moderator</div>
  )
}

export default Moderator