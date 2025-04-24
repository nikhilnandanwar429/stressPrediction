import React, { useEffect, useState } from 'react';

const MemberCard = ({ name, stressLevel, audioDetails }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        stressLevel > 70 ? 'bg-red-100 text-red-800' :
        stressLevel > 40 ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {stressLevel}% Stress
      </span>
    </div>
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        <span className="font-medium">Duration:</span> {audioDetails.duration}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium">Date:</span> {audioDetails.date}
      </p>
    </div>
  </div>
);

const GroupPage = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const results = localStorage.getItem('analysisResults');
    if (results) {
      const parsedResults = JSON.parse(results);
      const memberData = parsedResults.map((result, index) => ({
        id: index + 1,
        name: `audio ${index + 1}`,
        stressLevel: result.stressLevel,
        audioDetails: {
          duration: result.duration,
          date: result.date
        }
      }));
      setMembers(memberData);
    }
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Group Analysis</h1>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No analysis results available. Please upload audio files first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(member => (
              <MemberCard
                key={member.id}
                name={member.name}
                stressLevel={member.stressLevel}
                audioDetails={member.audioDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage; 