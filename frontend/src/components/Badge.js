import React from 'react';
export default function Badge({ id }) {
  const map = {
    '7-day': '7-day streak',
    '30-day': '30-day streak',
    '90-day': '90-day streak',
    '180-day': '180-day streak'
  };
  return <div className="badge">{map[id] || id}</div>;
}
