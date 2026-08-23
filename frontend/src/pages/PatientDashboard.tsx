import React from 'react';

const PatientDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Patient Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Find a Doctor</h3>
          <p className="text-gray-600 mb-4">Search by specialization or name.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">My Appointments</h3>
          <p className="text-gray-600">You have no upcoming appointments.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
