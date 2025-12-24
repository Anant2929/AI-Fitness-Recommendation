import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, Flame, Footprints, MapPin, Calendar, ClipboardList } from 'lucide-react';
import api from '../services/api';
import keycloak from '../keycloak';

const ActivityForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const userId = keycloak.tokenParsed?.sub;

    

    // Form State
    const [formData, setFormData] = useState({
        type: 'RUNNING',
        duration: 30,
        caloriesBurned: '',
        startTime: new Date().toISOString().slice(0, 16), // Current time for input
        distanceKm: '',
        steps: '',
        notes: ''
    });

    const activityTypes = [
        'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING',
        'WEIGHT_TRAINING', 'YOGA', 'HIIT', 'CARDIO',
        'STRETCHING', 'OTHER'
    ];

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            userId: userId, 
            type: formData.type,
            duration: parseInt(formData.duration),
            caloriesBurned: formData.caloriesBurned ? parseFloat(formData.caloriesBurned) : null,
            startTime: formData.startTime + ":00",
            additionalMetrics: {
                distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : null,
                steps: formData.steps ? parseInt(formData.steps) : null,
                notes: formData.notes
            }
        };

        api.logActivity(payload)
            .then((response) => {
                console.log("Activity Logged:", response);
                const activityId = response.id;

                navigate(`/analysis/${activityId}`);
            })
            .catch((err) => {
                console.error("Failed to log:", err);
                alert("Failed to log activity. Try again.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="card w-full max-w-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-red-50 to-transparent p-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="bg-primary text-white p-2 rounded-lg shadow-sm">
                            <Activity size={24} />
                        </div>
                        Log New Activity
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 ml-12">Track your progress and let AI analyze it.</p>
                </div>

                <div className="card-body p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Row 1: Type & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700">Activity Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="select select-bordered w-full bg-slate-50 focus:bg-white focus:border-primary transition-all text-slate-700"
                                >
                                    {activityTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label font-semibold text-slate-700">Start Time</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="input input-bordered w-full bg-slate-50 focus:bg-white focus:border-primary pl-10 transition-all text-slate-700"
                                        required
                                    />
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Duration & Calories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label font-semibold text-slate-700">Duration (mins)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        min="1"
                                        className="input input-bordered w-full bg-slate-50 focus:bg-white focus:border-primary pl-10 transition-all text-slate-700"
                                        required
                                    />
                                    <Clock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label font-semibold text-slate-700">Calories (kcal)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="caloriesBurned"
                                        value={formData.caloriesBurned}
                                        onChange={handleChange}
                                        placeholder="e.g. 400"
                                        className="input input-bordered w-full bg-slate-50 focus:bg-white focus:border-primary pl-10 transition-all text-slate-700"
                                    />
                                    <Flame size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Metrics Section */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                Additional Metrics
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label font-medium text-slate-600">Distance (km)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="distanceKm"
                                            step="0.1"
                                            value={formData.distanceKm}
                                            onChange={handleChange}
                                            placeholder="e.g. 5.2"
                                            className="input input-bordered w-full bg-white focus:border-primary pl-10 text-slate-700"
                                        />
                                        <MapPin size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label font-medium text-slate-600">Steps Count</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="steps"
                                            value={formData.steps}
                                            onChange={handleChange}
                                            placeholder="e.g. 6000"
                                            className="input input-bordered w-full bg-white focus:border-primary pl-10 text-slate-700"
                                        />
                                        <Footprints size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-control">
                            <label className="label font-semibold text-slate-700">Notes</label>
                            <div className="relative">
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered h-24 w-full bg-slate-50 focus:bg-white focus:border-primary transition-all text-slate-700 pl-10 pt-3"
                                    placeholder="How did you feel? Any pain or personal record?"
                                ></textarea>
                                <ClipboardList size={18} className="absolute left-3 top-3.5 text-slate-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full font-semibold text-slate-700 text-lg shadow-lg shadow-red-200 hover:shadow-red-300 border-none rounded-xl"
                        >
                            {isLoading ? <span className="loading loading-spinner"></span> : 'Save Activity 🚀'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm;