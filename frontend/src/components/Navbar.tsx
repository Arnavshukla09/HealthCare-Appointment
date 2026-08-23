import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">MediBridge</Link>
        <div className="space-x-4 flex items-center">
          {!user ? (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          ) : (
            <>
              <span className="text-gray-600 font-medium">Hello, {user.name} ({user.role})</span>
              {user.role === 'patient' && <Link to="/patient" className="hover:text-blue-600">Dashboard</Link>}
              {user.role === 'doctor' && <Link to="/doctor" className="hover:text-blue-600">Dashboard</Link>}
              {user.role === 'admin' && <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>}
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
