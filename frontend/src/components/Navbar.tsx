import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">MediBridge</Link>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/patient" className="text-gray-600 hover:text-blue-600">Patient</Link>
          <Link to="/doctor" className="text-gray-600 hover:text-blue-600">Doctor</Link>
          <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
