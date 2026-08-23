import { useEffect, useState } from 'react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking Form states
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    setLoading(false);
  }, []);

  const handleBookAppointment = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Calculate start and end times (dummy duration 30m)
      const startTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      // Step 1: Hold the slot
      const holdRes = await fetch('/api/appointments/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ doctorId: selectedDoctor, startTime: startTime.toISOString(), endTime: endTime.toISOString() })
      });

      if (!holdRes.ok) {
        const error = await holdRes.json();
        alert(`Failed to hold slot: ${error.message}`);
        return;
      }
      const holdData = await holdRes.json();

      // Step 2: Confirm Booking
      const bookRes = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ appointmentId: holdData._id, symptoms })
      });

      if (bookRes.ok) {
        alert('Appointment Booked Successfully!');
        setShowBookingModal(false);
        fetchAppointments(); // Refresh list
      } else {
        alert('Failed to confirm booking.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient Dashboard</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Book New Appointment</h2>
          <p className="text-gray-500">Select a doctor, time, and tell us your symptoms to schedule your visit.</p>
        </div>
        <button 
          onClick={() => setShowBookingModal(true)}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all"
        >
          Find a Doctor
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Upcoming Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 italic">You have no upcoming appointments.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt: any) => (
              <div key={apt._id} className="border p-6 rounded-xl hover:shadow-md transition-shadow bg-gray-50 relative">
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${apt.status === 'BOOKED' ? 'bg-blue-100 text-blue-700' : apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {apt.status}
                </span>
                <p className="font-bold text-gray-800 text-lg mb-1">{new Date(apt.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <p className="text-gray-600 font-medium mb-4">{new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="text-sm text-gray-500 border-t pt-4">
                  <p><strong>Doctor:</strong> {apt.doctor?.name || 'Dr. Sarah Smith'}</p>
                  <p className="mt-2 truncate"><strong>Symptoms:</strong> {apt.symptoms}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Schedule Appointment</h3>
            <form onSubmit={handleBookAppointment} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Doctor</label>
                <select required className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
                  <option value="" disabled>Choose a doctor...</option>
                  {doctors.map((doc: any) => (
                    <option key={doc._id} value={doc._id}>{doc.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input type="date" required className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                  <input type="time" required className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Symptoms (for AI Triage)</label>
                <textarea required rows={3} placeholder="E.g., I have had a mild fever and headache for 2 days..." className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white" value={symptoms} onChange={e => setSymptoms(e.target.value)}></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
