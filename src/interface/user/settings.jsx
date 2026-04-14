import React, { useEffect, useState } from 'react';

const Settings = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('register'));
    if (u) {
      setUser({
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        email: u.email || '',
        phone_number: u.phone_number || '',
        role: u.role || '',
      });
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-auto">
      <h1 className="text-2xl font-bold text-primary mb-6 text-center">Mening ma'lumotlarim</h1>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ism</label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">{user.first_name}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Familya</label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">{user.last_name}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">{user.email}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Telefon raqam</label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">{user.phone_number}</div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Rol</label>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">{user.role === 'kursant' ? 'Kursant' : 'O‘quvchi'}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;