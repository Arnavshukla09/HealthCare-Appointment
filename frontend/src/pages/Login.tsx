import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent, demoEmail?: string) => {
    e?.preventDefault();
    setError('');
    
    const loginEmail = demoEmail || email;
    const loginPassword = demoEmail ? 'password123' : password;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to MediBridge</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            className="w-full border rounded px-3 py-2" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full border rounded px-3 py-2" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4">
          Sign In
        </button>
      </form>

      <div className="border-t pt-4 mt-2">
        <p className="text-center text-gray-500 text-sm mb-3">Or use a Demo Account</p>
        <div className="space-y-2">
          <button 
            onClick={(e) => handleLogin(e, 'patient@medibridge.com')}
            className="w-full bg-green-100 text-green-800 py-2 rounded hover:bg-green-200 font-semibold"
          >
            Demo Patient Login
          </button>
          <button 
            onClick={(e) => handleLogin(e, 'doctor@medibridge.com')}
            className="w-full bg-indigo-100 text-indigo-800 py-2 rounded hover:bg-indigo-200 font-semibold"
          >
            Demo Doctor Login
          </button>
          <button 
            onClick={(e) => handleLogin(e, 'admin@medibridge.com')}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 font-semibold"
          >
            Demo Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
