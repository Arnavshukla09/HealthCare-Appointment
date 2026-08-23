import React from 'react';

const DoctorDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Today's Agenda</h3>
        <p className="text-gray-600">No appointments scheduled for today.</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
