import { useState , useEffect } from 'react';
import { User, Ruler, Weight, Activity, AlertTriangle, Save, Edit2, Camera } from 'lucide-react';
import keycloak from '../keycloak'; 
import api from '../services/api';   

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = keycloak.tokenParsed?.sub;
  const firstName = keycloak.tokenParsed?.given_name || "User";
  const lastName = keycloak.tokenParsed?.family_name || "";
  const email = keycloak.tokenParsed?.email || "";

  const [profile, setProfile] = useState({
    age: "",
    weight: "",
    height: "",
    fitnessLevel: "BEGINNER",
    injuryStatus: "NONE"
  });

  useEffect(() => {
    if (userId) {
      api.getUserProfile(userId)
        .then(data => {
          console.log("Fetched Profile:", data);
          // Backend data ko state me set karo
          setProfile({
            age: data.age || "",
            weight: data.weight || "",
            height: data.height || "",
            fitnessLevel: data.fitnessLevel || "BEGINNER",
            injuryStatus: data.injuryStatus || "NONE"
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
          setIsLoading(false);
        });
    }
  }, [userId]);

  const bmi = profile.weight && profile.height 
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) 
    : "--";

  // Dropdown Options
  const fitnessLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ATHLETE"];
  const injuryStatuses = ["NONE", "KNEE_PAIN", "BACK_PAIN", "SHOULDER_INJURY", "RECOVERING"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Backend ko wahi data bhejo jo required hai
    const payload = {
       age: parseInt(profile.age),
       weight: parseFloat(profile.weight),
       height: parseFloat(profile.height),
       fitnessLevel: profile.fitnessLevel,
       injuryStatus: profile.injuryStatus
    };

    api.updateHealthData(userId, payload)
      .then(response => {
        console.log("Updated Successfully:", response);
        setIsEditing(false);
        alert("Profile Updated Successfully! ✅");
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update profile ❌");
      })
      .finally(() => setIsLoading(false));
  };

  if (isLoading && !profile.weight) {
      return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-fade-in-up flex justify-center">
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1">
          <div className="card bg-white shadow-xl border border-slate-100 overflow-hidden text-center">
            <div className="bg-primary/10 h-32 relative">
               {/* Background Pattern */}
            </div>
            
            <div className="avatar placeholder -mt-12 justify-center">
              <div className="bg-slate-800 text-white rounded-full w-24 shadow-lg border-4 border-white text-3xl font-bold flex items-center justify-center relative group cursor-pointer">
                <span>{firstName}{lastName}</span>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} />
                </div>
              </div>
            </div>

            <div className="card-body pt-2 pb-6">
              <h2 className="text-2xl font-bold text-slate-800">{firstName} {lastName}</h2>
              <p className="text-slate-500 text-sm">{email}</p>
              
              <div className="divider my-2"></div>
              
              {/* BMI Badge */}
              <div className="stats bg-slate-50 shadow-sm border border-slate-100">
                <div className="stat p-4">
                  <div className="stat-title text-xs uppercase tracking-wide">BMI Score</div>
                  <div className="stat-value text-primary text-2xl">{bmi}</div>
                  <div className="stat-desc text-xs font-medium">
                    {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : "Overweight"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Health Stats Form */}
        <div className="md:col-span-2">
          <div className="card bg-white shadow-xl border border-slate-100 h-full">
            <div className="card-body">
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-xl text-slate-800 flex items-center gap-2">
                  <Activity className="text-primary" size={20}/> Health Profile
                </h2>
                <button 
                  onClick={() => !isLoading && (isEditing ? handleSave() : setIsEditing(true))}
                  className={`btn btn-sm ${isEditing ? 'btn-primary border-slate-200' : 'btn-ghost border-slate-200'}`}
                >
                  {isLoading ? <span className="loading loading-spinner"></span> : 
                    isEditing ? <><Save size={16}/> Save Changes</> : <><Edit2 size={16}/> Edit Profile</>
                  }
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Age */}
                <div className="form-control">
                  <label className="label font-medium text-slate-500">Age (years)</label>
                  <input 
                    type="number" 
                    name="age"
                    value={profile.age} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input input-bordered bg-slate-50 focus:bg-white focus:border-primary font-semibold text-slate-800 disabled:bg-white disabled:border-none disabled:pl-0 disabled:text-lg"
                  />
                </div>

                {/* Fitness Level */}
                <div className="form-control">
                  <label className="label font-medium text-slate-500">Fitness Level</label>
                  {isEditing ? (
                    <select 
                      name="fitnessLevel" 
                      value={profile.fitnessLevel} 
                      onChange={handleChange}
                      className="select select-bordered bg-slate-50 focus:border-primary w-full"
                    >
                      {fitnessLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  ) : (
                    <div className="badge badge-primary badge-outline p-3 font-bold mt-2">
                      {profile.fitnessLevel}
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div className="form-control">
                  <label className="label font-medium text-slate-500 flex items-center gap-2">
                    <Weight size={16}/> Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    name="weight"
                    value={profile.weight} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input input-bordered bg-slate-50 focus:bg-white focus:border-primary font-semibold text-slate-800 disabled:bg-white disabled:border-none disabled:pl-0 disabled:text-lg"
                  />
                </div>

                {/* Height */}
                <div className="form-control">
                  <label className="label font-medium text-slate-500 flex items-center gap-2">
                    <Ruler size={16}/> Height (cm)
                  </label>
                  <input 
                    type="number" 
                    name="height"
                    value={profile.height} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input input-bordered bg-slate-50 focus:bg-white focus:border-primary font-semibold text-slate-800 disabled:bg-white disabled:border-none disabled:pl-0 disabled:text-lg"
                  />
                </div>

                {/* Injury Status (Full Width) */}
                <div className="md:col-span-2 form-control">
                  <label className="label font-medium text-slate-500 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500"/> Injury Status
                  </label>
                  
                  {isEditing ? (
                    <select 
                      name="injuryStatus" 
                      value={profile.injuryStatus} 
                      onChange={handleChange}
                      className="select select-bordered bg-slate-50 focus:border-primary w-full"
                    >
                      {injuryStatuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  ) : (
                    <div className={`alert ${profile.injuryStatus === 'NONE' ? 'alert-success' : 'alert-warning'} py-2 flex items-start`}>
                      {profile.injuryStatus === 'NONE' ? <span>No active injuries. Ready to train! 💪</span> : 
                        <span>⚠️ Active Injury: <strong>{profile.injuryStatus.replace('_', ' ')}</strong>. AI recommendations will adjust accordingly.</span>
                      }
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Profile;