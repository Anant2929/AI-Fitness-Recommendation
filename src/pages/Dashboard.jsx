import { Flame, Clock, Zap, TrendingUp , ArrowRight} from 'lucide-react';
import api from '../services/api';
import keycloak from '../keycloak';
import { useState , useEffect} from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const userId = keycloak.tokenParsed?.sub;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    if (userId) {
      // Get User Recommendations (History)
      api.getUserRecommendations(userId)
        .then(data => {
          // Backend se List<FinalRecommendation> aaega
          // Reverse karke latest upar dikhao aur slice(0,3) for top 3
          setActivities(data.reverse().slice(0, 3));
        })
        .catch(err => console.error(err));
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in-up">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Hello, Champion! <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Ready to crush your goals today?
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-slate-600 font-semibold">
          <span className="bg-slate-100 p-1.5 rounded-lg">📅</span>
          <span>{today}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Calories */}
        <div className="card bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="card-body flex-row items-center gap-4">
            <div className="p-4 rounded-2xl bg-red-50 text-primary">
              <Flame size={24} />
            </div>
            <div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Calories</div>
              <div className="text-3xl font-bold text-slate-800">1,200</div>
              <div className="text-xs text-green-600 font-bold flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" /> 12% vs yesterday
              </div>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="card bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="card-body flex-row items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 text-secondary">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Active Time</div>
              <div className="text-3xl font-bold text-slate-800">2h 15m</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Total session time</div>
            </div>
          </div>
        </div>

        {/* Workouts */}
        <div className="card bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="card-body flex-row items-center gap-4">
            <div className="p-4 rounded-2xl bg-teal-50 text-teal-600">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Workouts</div>
              <div className="text-3xl font-bold text-slate-800">3</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Running, Gym, Yoga</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach & Recent */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* AI Coach */}
        <div className="card bg-white shadow-md border-l-4 border-primary col-span-1 lg:col-span-2">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <h2 className="card-title text-slate-800 font-bold">AI Coach Insight</h2>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-slate-700 leading-relaxed text-lg">
                "Great job on your 5km run! 🏃‍♂️ Your pace of <span className="font-bold text-primary">5:30/km</span> is consistent.
                To improve endurance, try maintaining Zone 2 heart rate for the next 10 minutes."
              </p>
            </div>
          </div>
        </div>

        {/* Recent List - Static for now */}
        <div className="card bg-white shadow-md border border-slate-100">
          <div className="card-body p-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Recommendations</h2>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-slate-400 text-sm">No activities yet. Go log one!</p>
              ) : (
                activities.map((item) => (
                  <Link to={`/analysis/${item.activityId}`} key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                      {item.type.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 capitalize">{item.type.toLowerCase()}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.status}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-primary" />
                  </Link>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;