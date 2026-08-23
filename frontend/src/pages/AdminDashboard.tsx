import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingApts, setLoadingApts] = useState(true);
  
  // Modals state
  const [showAddUser, setShowAddUser] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [leaveForm, setLeaveForm] = useState({ doctorId: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/appointments', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApts(false);
    }
  };

  const handleAddUser = async (e: any) => {
    e.preventDefault();
    try {
      // If adding a doctor, we might want to use the specific /api/admin/doctor endpoint 
      // but for simplicity and since the user requested "add new users of any type", 
      // we can just use the public register endpoint which accepts role.
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        alert('User added successfully!');
        setShowAddUser(false);
        fetchUsers();
      } else {
        alert('Failed to add user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User deleted');
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointment = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAppointments();
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
        alert('Leave scheduled successfully! Conflicting appointments have been cancelled.');
        setShowLeaveModal(false);
        fetchAppointments();
      } else {
        alert('Failed to schedule leave');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Control Center</h2>
        <div className="space-x-4">
          <button 
            onClick={() => setShowAddUser(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            + Add New User
          </button>
          <button 
            onClick={() => setShowLeaveModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            🗓 Schedule Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Users</h3>
          {loadingUsers ? <p>Loading...</p> : (
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: any) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 font-semibold border border-red-200 hover:bg-red-50 px-2 py-1 rounded">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Appointments</h3>
          {loadingApts ? <p>Loading...</p> : (
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((apt: any) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{new Date(apt.startTime).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{new Date(apt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'booked' ? 'bg-blue-100 text-blue-800' : apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select 
                          className="border rounded p-1 text-sm bg-gray-50 focus:outline-none"
                          value={apt.status}
                          onChange={(e) => handleUpdateAppointment(apt._id, e.target.value)}
                        >
                          <option value="booked">Booked</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Register New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="mt-1 block w-full border rounded-md shadow-sm p-2" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddUser(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Schedule Doctor Leave</h3>
            <form onSubmit={handleScheduleLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                <input type="text" placeholder="Paste doctor's _id here" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setLeaveForm({...leaveForm, doctorId: e.target.value})} />
                <p className="text-xs text-gray-500 mt-1">Get ID from the Users table</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" required className="mt-1 block w-full border rounded-md shadow-sm p-2" onChange={e => setLeaveForm({...leaveForm, leaveDate: e.target.value} as any)} />
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
