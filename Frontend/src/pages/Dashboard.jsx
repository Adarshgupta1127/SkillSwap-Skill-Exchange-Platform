import React, { useEffect, useState } from 'react';
import api from '../api/api';
import SkillCard from '../components/SkillCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [q, setQ] = useState('');

  const fetch = async () => {
    const { data } = await api.get(`/skills?q=${encodeURIComponent(q)}`);
    setSkills(data);
  };

  useEffect(()=>{ fetch(); }, [q]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Browse Skills</h1>
        <Link to="/create" className="px-3 py-1 border rounded">Create Skill</Link>
      </div>

      <input placeholder="Search tag or title" value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 mb-4 border rounded" />

      <div className="grid gap-4">
        {skills.map(s => <SkillCard key={s._id} skill={s} />)}
      </div>
    </div>
  );
}
