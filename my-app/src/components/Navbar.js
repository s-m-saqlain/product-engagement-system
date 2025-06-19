import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Product Engagement</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;