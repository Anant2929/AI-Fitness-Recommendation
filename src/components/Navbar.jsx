import { Link } from 'react-router-dom';
import { LogOut, User, Plus, BarChart2 } from 'lucide-react';
import keycloak from '../keycloak'; 

const Navbar = () => {
  const username = keycloak.tokenParsed?.preferred_username || "User";
  const userInitial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <div className="navbar bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100 px-4">
      
      {/* Left: Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-extrabold tracking-tight hover:bg-transparent px-0">
          <span className="text-slate-800">AI</span><span className="text-primary">Fitness</span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex-none flex items-center gap-4">
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-1">
            <Link to="/" className="btn btn-ghost btn-sm text-slate-600 font-medium hover:text-primary hover:bg-red-50">
            Dashboard
            </Link>
            <Link to="/analytics" className="btn btn-ghost btn-sm text-slate-600 font-medium hover:text-primary hover:bg-red-50">
            <BarChart2 size={16} className="mr-1"/> Progress
            </Link>
        </div>

        {/* Primary Action */}
        <Link to="/activity" className="btn btn-primary btn-sm text-white shadow-md shadow-red-200 rounded-full px-4 border-none hover:shadow-lg hover:shadow-red-300 transition-all flex items-center gap-1">
          <Plus size={16} />
          <span className="hidden sm:inline">Log Activity</span>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-circle btn-ghost avatar placeholder border border-gray-200 hover:border-primary transition-colors">
            <div className="bg-slate-800 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold">{userInitial}</span>
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-box w-52 border border-gray-100">
            <li className="px-4 py-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
               Hello, {username}
            </li>
            <div className="divider my-0"></div>
            <li><Link to="/profile" className="text-slate-700 font-medium hover:bg-slate-50"><User size={16}/> Profile</Link></li>
            <li>
                {/* LOGOUT BUTTON */}
                <button onClick={handleLogout} className="text-red-600 font-medium hover:bg-red-50">
                    <LogOut size={16}/> Logout
                </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;