import { useEffect, useState } from 'react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/appointments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
        <p className="text-gray-600 mb-4">Select a doctor and time to schedule your visit.</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Find a Doctor
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">You have no upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt: any) => (
              <div key={apt._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{new Date(apt.startTime).toLocaleString()}</p>
                  <p className="text-gray-600">Status: {apt.status}</p>
                </div>
                <button className="text-red-500 hover:underline">Cancel</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
