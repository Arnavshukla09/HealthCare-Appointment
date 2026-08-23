import React from 'react';

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MediBridge</h1>
      <p className="text-gray-600 mb-8">Next-Gen Healthcare Management & AI-Powered Clinical Summarizer</p>
      <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
        Get Started
      </a>
    </div>
  );
};

export default Home;
