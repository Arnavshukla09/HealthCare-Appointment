import { useEffect, useState } from 'react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Notes Modal state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [notes, setNotes] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmitNotes = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/doctor/post-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ appointmentId: selectedAppointment._id, notes })
      });
      
      if (res.ok) {
        alert('Notes submitted successfully! AI is generating the patient summary.');
        setShowNotesModal(false);
        setNotes('');
        fetchAppointments();
      } else {
        alert('Failed to submit notes.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openNotesModal = (apt: any) => {
    setSelectedAppointment(apt);
    setShowNotesModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctor Dashboard</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Patient Appointments</h2>
        {loading ? (
          <p>Loading schedule...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 italic">You have no upcoming appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((apt: any) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{new Date(apt.startTime).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{new Date(apt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{apt.patient?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'booked' ? 'bg-blue-100 text-blue-800' : apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {apt.status === 'booked' && (
                        <button 
                          onClick={() => openNotesModal(apt)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold border border-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
                        >
                          Add Post-Visit Notes
                        </button>
                      )}
                      {apt.status === 'completed' && <span className="text-gray-400">Completed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Post-Visit Notes</h3>
            <p className="text-gray-500 mb-6">Enter clinical notes for {selectedAppointment?.patient?.name}. The AI will summarize this for the patient.</p>
            <form onSubmit={handleSubmitNotes} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Clinical Notes</label>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="Patient presented with mild fever. Advised paracetamol 500mg twice a day for 3 days. Drink plenty of fluids..." 
                  className="block w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white" 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowNotesModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md">Submit Notes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
