import { useState, useEffect } from 'react';
import { Flame, Trophy, Footprints, Map, Zap, Target, Medal, Star } from 'lucide-react';
import keycloak from '../keycloak';
import api from '../services/api';

const AnalyticsHub = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = keycloak.tokenParsed?.sub;

  // Gamification Logic (Badges)
  const calculateBadges = (data) => {
    const badges = [
      { id: 1, name: "First Step", icon: <Footprints/>, condition: data.totalSteps > 1000, desc: "Walked 1k+ Steps" },
      { id: 2, name: "On Fire", icon: <Flame/>, condition: data.currentStreak >= 3, desc: "3 Day Streak" },
      { id: 3, name: "Marathoner", icon: <Map/>, condition: data.totalDistanceKm > 42, desc: "Covered 42km+" },
      { id: 4, name: "Calorie Crusher", icon: <Zap/>, condition: data.totalCaloriesBurned > 5000, desc: "Burned 5k+ Cals" },
    ];
    return badges;
  };

  useEffect(() => {
    if (userId) {
      api.getUserAnalytics(userId)
        .then(data => {
          console.log("Redis Analytics Data:", data);
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching analytics:", err);
          setStats({
              totalSteps: 0,
              totalCaloriesBurned: 0,
              totalDistanceKm: 0,
              currentStreak: 0
          });
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!stats) return <div>No Data Found</div>;

  const badges = calculateBadges(stats);
  const nextLevelXP = 20000;
  const currentXP = stats.totalSteps ||0; 
  const progressPercent = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 1. HERO SECTION: STREAK & LEVEL */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
            
            {/* Streak Counter */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-sm mb-1">
                <Flame className="animate-pulse" fill="currentColor" /> Current Streak
              </div>
              <h1 className="text-6xl font-black">{stats.currentStreak} <span className="text-2xl font-medium text-slate-400">Days</span></h1>
              <p className="text-slate-400 text-sm mt-2">You are unstoppable! Keep it up to earn more xp.</p>
            </div>

            {/* Level Progress */}
            <div className="w-full md:w-1/2 bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Current Level</span>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    <Star className="text-yellow-400" fill="currentColor"/> Level 5
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">{currentXP} / {nextLevelXP} XP (Steps)</span>
                </div>
              </div>
              <progress className="progress progress-primary w-full h-3" value={progressPercent} max="100"></progress>
              <p className="text-xs text-slate-500 mt-2 text-right">Reach 20k steps to level up!</p>
            </div>
          </div>
        </div>

        {/* 2. LIFETIME STATS GRID (Redis Data) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Steps */}
          <div className="card bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Footprints size={28} />
                </div>
                <div>
                  <p className="text-slate-500 font-medium text-xs uppercase">Total Steps</p>
                  <h3 className="text-3xl font-bold text-slate-800">{stats.totalSteps.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Calories */}
          <div className="card bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                  <Zap size={28} />
                </div>
                <div>
                  <p className="text-slate-500 font-medium text-xs uppercase">Total Burned</p>
                  <h3 className="text-3xl font-bold text-slate-800">{stats.totalCaloriesBurned.toLocaleString()} <span className="text-sm text-slate-400">kcal</span></h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Distance */}
          <div className="card bg-white shadow-md border border-slate-100 hover:shadow-lg transition-all">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <Map size={28} />
                </div>
                <div>
                  <p className="text-slate-500 font-medium text-xs uppercase">Distance Covered</p>
                  <h3 className="text-3xl font-bold text-slate-800">{stats.totalDistanceKm} <span className="text-sm text-slate-400">km</span></h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TROPHY CABINET (Unlocked based on Redis Data) */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Trophy Cabinet
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className={`card border ${badge.condition ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
                <div className="card-body p-4 items-center text-center">
                  <div className={`p-3 rounded-full mb-2 ${badge.condition ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">{badge.name}</h4>
                  <p className="text-xs text-slate-500">{badge.desc}</p>
                  {badge.condition ? 
                    <div className="badge badge-xs badge-success mt-2">Unlocked</div> : 
                    <div className="badge badge-xs badge-ghost mt-2">Locked</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsHub;