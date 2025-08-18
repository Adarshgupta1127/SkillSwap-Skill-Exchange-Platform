import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function CreateSkill() {
  const [form, setForm] = useState({ title: '', description: '', tags: '', type: 'offer' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t=>t.trim().toLowerCase()) };
      await api.post('/skills', payload);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg mb-3">Create Skill</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full p-2 border rounded" />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-2 border rounded" />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="w-full p-2 border rounded" />
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full p-2 border rounded">
          <option value="offer">Offer</option>
          <option value="seek">Seek</option>
        </select>
        <button className="w-full py-2 bg-blue-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
