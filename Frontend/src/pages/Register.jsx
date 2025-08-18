import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const nav = useNavigate();
  const { login } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handle} className="space-y-3">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border rounded"/>
        <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full p-2 border rounded"/>
        <input required placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full p-2 border rounded"/>
        <textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full p-2 border rounded"></textarea>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">Register</button>
      </form>
    </div>
  );
}
