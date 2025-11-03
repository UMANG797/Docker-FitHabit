import React, { useState } from 'react';
import axios from 'axios';

export default function NewHabitForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const create = async () => {
    if (!title.trim()) return alert('Add a title');
    await axios.post('/api/habits', { title, description: desc });
    setTitle(''); setDesc('');
    onCreated && onCreated();
  };

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <input placeholder="Habit title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Short desc" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button className="button button-primary small" onClick={create}>Add</button>
    </div>
  );
}
