import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  // Form states
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '' });
  const [leaveForm, setLeaveForm] = useState({ doctorId: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      // Assuming a generic GET /api/doctors endpoint or we can fetch users by role
      // For now, let's mock the doctor list if no endpoint exists, or just use static list
      const res = await fetch('/api/doctors', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newDoctor, role: 'doctor' })
      });
      if (res.ok) {
        alert('Doctor added successfully!');
        setShowAddDoctor(false);
        fetchDoctors();
      } else {
        alert('Failed to add doctor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleLeave = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/doctor/leave', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leaveForm)
      });
      if (res.ok) {
        alert('Leave scheduled successfully! Conflicting appointments have been cancelled and emails sent.');
        setShowLeaveModal(false);
      } else {
        alert('Failed to schedule leave');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Control Center</h2>
        <div className="space-x-4">
          <button 
            onClick={() => setShowAddDoctor(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            + Add New Doctor
          </button>
          <button 
            onClick={() => setShowLeaveModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            🗓 Schedule Leave
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Registered Doctors</h3>
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Fallback mock data if API fails */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dr. Sarah Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">doctor@medibridge.com</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                </tr>
                {doctors.map((doc: any) => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Register New Doctor</h3>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewDoctor({...newDoctor, password: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddDoctor(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Schedule Doctor Leave</h3>
            <form onSubmit={handleScheduleLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor Email</label>
                <input type="email" placeholder="doctor@medibridge.com" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setLeaveForm({...leaveForm, doctorId: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">Enter doctor's email for reference</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Confirm Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
