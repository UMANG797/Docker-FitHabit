import React from 'react';
import axios from 'axios';
import Badge from './Badge';

export default function HabitCard({ habit, onUpdated, onDeleted }) {
  const percent = Math.min(100, Math.round((habit.streak/30)*100)); // show relative progress to 30 days

  const complete = async () => {
    await axios.post(`/api/habits/${habit._id}/complete`);
    onUpdated && onUpdated();
  };

  const reset = async () => {
    if (!window.confirm('Reset this habit?')) return;
    await axios.put(`/api/habits/${habit._id}/reset`);
    onUpdated && onUpdated();
  };

  const del = async () => {
    if (!window.confirm('Delete this habit permanently?')) return;
    await axios.delete(`/api/habits/${habit._id}`);
    onDeleted && onDeleted();
  };

  return (
    <div className="habit-card">
      <h3 className="habit-title">{habit.title}</h3>
      <div className="habit-desc">{habit.description}</div>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:12,color:'#444'}}>Streak: <strong>{habit.streak}</strong> days</div>
          <div style={{fontSize:12,color:'#666'}}>Best: {habit.bestStreak}</div>
        </div>
        <div>
          <button onClick={complete} className="button small button-primary">✔ Today</button>
        </div>
      </div>

      <div style={{marginTop:10}}>
        <div className="progress"><div className="bar" style={{width: percent + '%', background:'#3b82f6'}}/></div>
      </div>

      <div className="badges">
        {habit.badges && habit.badges.map(b => <Badge key={b} id={b} />)}
      </div>

      <div style={{display:'flex',gap:8, marginTop:10}}>
        <button className="button button-ghost small" onClick={reset}>Reset</button>
        <button className="button small" onClick={del}>Delete</button>
      </div>
    </div>
  );
}
