import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Fixed: Duplicate imports merged
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Heart, 
  Zap, 
  Flame, 
  Timer, 
  ArrowRight,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
import api from '../services/api';

const ActivityAnalysis = () => {
  const { activityId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalysis = () => {
      api.getActivityRecommendation(activityId)
        .then((response) => {
          if (isMounted) {
            setData(response);
            setLoading(false);
            console.log("AI Analysis Data:", response);
          }
        })
        .catch((err) => {
          console.log(`Waiting for AI... Attempt ${retryCount + 1}`);
          // Retry logic (Polling)
          if (retryCount < 5) {
            setTimeout(() => {
              if (isMounted) setRetryCount(prev => prev + 1);
            }, 2000); 
          } else {
            if (isMounted) {
              setError("AI is taking longer than expected. Please check back later from Dashboard.");
              setLoading(false);
            }
          }
        });
    };

    fetchAnalysis();

    return () => { isMounted = false; };
  }, [activityId, retryCount]);

  // Helper to determine Color Theme based on Status
  const getStatusTheme = (status) => {
    if (!status) return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-600', icon: <Info size={48} className="text-slate-400"/>, badge: 'badge-ghost'};

    switch (status) {
      case 'MODIFIED': // Injury/Safety Risk
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <ShieldAlert size={48} className="text-red-600" />,
          badge: 'badge-error'
        };
      case 'ENHANCED': // Beginner Tips
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info size={48} className="text-blue-600" />,
          badge: 'badge-info'
        };
      default: // APPLIED (All Good)
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle size={48} className="text-green-600" />,
          badge: 'badge-success'
        };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-slate-500 font-medium animate-pulse">
        AI is analyzing your workout... ({retryCount + 1}/5)
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="alert alert-warning">
            <AlertTriangle />
            <span>{error}</span>
            <Link to="/" className="btn btn-sm">Go Dashboard</Link>
        </div>
    </div>
  );

  const parseReasoning = (text) => {
    if (!text) return {};

    try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'object') return parsed;
    } catch (e) {
      
    }

    const extractSection = (startKey, endKey) => {
        const startIndex = text.indexOf(startKey);
        if (startIndex === -1) return null;

        const actualStart = startIndex + startKey.length;
        
        let actualEnd = text.length;
        if (endKey) {
            const endIndex = text.indexOf(endKey, actualStart);
            if (endIndex !== -1) actualEnd = endIndex;
        }

        return text.substring(actualStart, actualEnd).trim();
    };

    return {
        overall: extractSection("Overall:", "Pace:") || text,
        pace: extractSection("Pace:", "Heart Rate:"),
        heartRate: extractSection("Heart Rate:", "Calories:"),
        caloriesBurned: extractSection("Calories:", null)
    };
  };

  // Ab AI Details ko populate karo
  const aiDetails = parseReasoning(data.aiReasoning);

  const theme = getStatusTheme(data.status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in-up">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER: Final Advice */}
        <div className={`card shadow-xl border ${theme.border} ${theme.bg}`}>
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Status Icon */}
              <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100">
                {theme.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-800">Analysis Result</h1>
                  <span className={`badge ${theme.badge} text-white font-bold p-3`}>
                    {data.status}
                  </span>
                </div>
                
                {/* FINAL ADVICE */}
                <p className={`text-lg font-medium leading-relaxed ${theme.text}`}>
                  {data.finalAction}
                </p>

                {/* SAFETY WARNINGS */}
                {data.safetyWarnings?.length > 0 && (
                  <div className="mt-4 bg-white/60 p-4 rounded-xl border border-red-100">
                    <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2 text-sm uppercase tracking-wide">
                      <AlertTriangle size={16}/> Safety Warnings
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-red-600 text-sm font-medium">
                      {data.safetyWarnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500"/> Deep Dive Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Overall */}
            <div className="card bg-white border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Overall Performance</h3>
              <p className="text-slate-700">{aiDetails.overall || "Analysis pending..."}</p>
            </div>

            {/* Pace */}
            <div className="card bg-white border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Timer size={14}/> Pace Analysis
              </h3>
              <p className="text-slate-700">{aiDetails.pace || "N/A"}</p>
            </div>

            {/* Heart Rate */}
            <div className="card bg-white border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Heart size={14} className="text-red-500"/> Heart Rate Response
              </h3>
              <p className="text-slate-700">{aiDetails.heartRate || "N/A"}</p>
            </div>

            {/* Calories */}
            <div className="card bg-white border border-slate-100 shadow-sm p-4">
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Flame size={14} className="text-orange-500"/> Caloric Burn
              </h3>
              <p className="text-slate-700">{aiDetails.caloriesBurned || "N/A"}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityAnalysis;