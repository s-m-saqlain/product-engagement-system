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
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Product Engagement System</h1>
      {user && (
        <div className="flex items-center">
          <span className="mr-4">{user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;