const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Manage Doctors</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Add New Doctor</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Leave Management</h3>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded">Schedule Leave</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
