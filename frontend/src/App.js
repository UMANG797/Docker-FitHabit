import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Flame, Target, Star, Award, Zap, Crown, TrendingUp, CheckCircle, Gift, Plus, X, RotateCcw, TrendingDown } from 'lucide-react';

// Badge System with detailed descriptions
const BADGE_SYSTEM = {
  '7-day': {
    icon: Target,
    name: '7-Day Warrior',
    description: 'Maintained a 7-day streak',
    color: 'from-blue-400 to-blue-600',
    requirement: 7
  },
  '30-day': {
    icon: Award,
    name: '30-Day Master',
    description: 'Achieved a full 30-day streak',
    color: 'from-yellow-400 to-orange-500',
    requirement: 30
  },
  '90-day': {
    icon: Zap,
    name: '90-Day Champion',
    description: 'Reached an incredible 90-day streak',
    color: 'from-cyan-400 to-blue-500',
    requirement: 90
  },
  '180-day': {
    icon: Crown,
    name: '180-Day Legend',
    description: 'Legendary 180-day achievement',
    color: 'from-yellow-300 via-yellow-500 to-yellow-700',
    requirement: 180
  }
};

function Badge({ id, size = 'md', showTooltip = true }) {
  const badge = BADGE_SYSTEM[id];
  if (!badge) return null;

  const Icon = badge.icon;
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="group relative inline-block">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${badge.color} p-2 shadow-lg flex items-center justify-center transform transition-transform hover:scale-110`}>
        <Icon className="w-full h-full text-white" strokeWidth={2.5} />
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-300 text-xs">{badge.description}</div>
        </div>
      )}
    </div>
  );
}

function BadgeShowcase() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Badge Collection</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Build streaks to unlock exclusive badges and celebrate your progress!</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(BADGE_SYSTEM).map(([id, badge]) => {
          const Icon = badge.icon;
          return (
            <div key={id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} p-2.5 mb-3 mx-auto shadow-md`}>
                <Icon className="w-full h-full text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-gray-500">{badge.description}</div>
                <div className="mt-2 inline-block px-2 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                  {badge.requirement} days
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewHabitForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const create = async () => {
    if (!title.trim()) {
      alert('Please add a title');
      return;
    }
    
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/habits`, { title, description: desc });
      setTitle('');
      setDesc('');
      setIsExpanded(false);
      onCreated && onCreated();
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Create New Habit
        </button>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter habit title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
            autoFocus
          />
          <textarea
            placeholder="Add a short description (optional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          />
          <div className="flex gap-3">
            <button
              onClick={create}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              Add Habit
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setDesc('');
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit, onUpdated, onDeleted }) {
  const calculateBadges = (streak) => {
    const badges = [];
    if (streak >= 7) badges.push('7-day');
    if (streak >= 30) badges.push('30-day');
    if (streak >= 90) badges.push('90-day');
    if (streak >= 180) badges.push('180-day');
    return badges;
  };

  const currentBadges = habit.badges || calculateBadges(habit.streak);
  const allBadgeThresholds = [
    { id: '7-day', req: 7 },
    { id: '30-day', req: 30 },
    { id: '90-day', req: 90 },
    { id: '180-day', req: 180 }
  ];
  
  const nextBadge = allBadgeThresholds.find(b => habit.streak < b.req);

  const complete = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/habits/${habit._id}/complete`);
      onUpdated && onUpdated();
    } catch (error) {
      console.error('Error completing habit:', error);
      alert('Failed to complete habit. Please try again.');
    }
  };

  const reset = async () => {
    if (!window.confirm('Reset this habit streak?')) return;
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/habits/${habit._id}/reset`);
      onUpdated && onUpdated();
    } catch (error) {
      console.error('Error resetting habit:', error);
      alert('Failed to reset habit. Please try again.');
    }
  };

  const del = async () => {
    if (!window.confirm('Delete this habit permanently?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/habits/${habit._id}`);
      onDeleted && onDeleted();
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Failed to delete habit. Please try again.');
    }
  };

  const progress = habit.streak === 0 ? 0 : Math.min(100, (habit.streak / 30) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 p-6 relative overflow-hidden group">
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-800 leading-tight pr-4">{habit.title}</h3>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full shrink-0 shadow-sm">
            <Flame className="w-5 h-5 text-orange-600" />
            <span className="text-xl font-bold text-orange-700">{habit.streak}</span>
          </div>
        </div>
        <p className="text-gray-600 text-base leading-relaxed">{habit.description || 'No description'}</p>
      </div>

      {/* Progress Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-5 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">Progress to 30 days</span>
          <span className="text-lg font-bold text-purple-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Badges Section */}
      {currentBadges.length > 0 ? (
        <div className="mb-5">
          <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            Earned Badges
          </div>
          <div className="flex flex-wrap gap-3">
            {currentBadges.map(badgeId => (
              <Badge key={badgeId} id={badgeId} size="sm" />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-5 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-bold text-gray-600">No badges yet</span>
          </div>
          <div className="text-sm text-gray-500">
            {nextBadge ? (
              <>
                <span className="font-semibold text-blue-600">{nextBadge.req - habit.streak} more days</span> to unlock "{BADGE_SYSTEM[nextBadge.id].name}"
              </>
            ) : 'Keep going to unlock badges!'}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-5 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-gray-700">Best: <strong className="text-yellow-700">{habit.bestStreak}</strong></span>
        </div>
        {nextBadge && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Next: <strong className="text-blue-700">{nextBadge.req}</strong></span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={complete}
          className="flex-1 py-3.5 px-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-base hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Complete Today
        </button>
        <button
          onClick={reset}
          className="px-4 py-3.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
          title="Reset streak"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={del}
          className="px-4 py-3.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
          title="Delete habit"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/habits`);
      setHabits(res.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchHabits(); 
  }, []);

  const avgStreak = habits.length
    ? (habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length).toFixed(1)
    : 0;

  const totalBadges = habits.reduce((sum, h) => {
    const badges = [7, 30, 90, 180].filter(req => h.streak >= req);
    return sum + badges.length;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FitHabit
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track habits • Build streaks • Unlock achievements</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{habits.length}</div>
                <div className="text-sm font-semibold text-gray-600">Active Habits</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{avgStreak}</div>
                <div className="text-sm font-semibold text-gray-600">Average Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalBadges}</div>
                <div className="text-sm font-semibold text-gray-600">Badges Earned</div>
              </div>
            </div>
          </div>
        </div>

        <BadgeShowcase />

        <NewHabitForm onCreated={fetchHabits} />

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-200">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No habits yet</h3>
            <p className="text-gray-500 text-lg mb-6">Create your first habit to start building amazing streaks!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onUpdated={fetchHabits}
                onDeleted={fetchHabits}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}