import React from 'react';

const TeamMember = ({ name, role, bio, imageUrl }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="h-48 overflow-hidden">
      <img 
        src={imageUrl || 'https://via.placeholder.com/400x300?text=Team+Member'} 
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-blue-600 mb-3">{role}</p>
      <p className="text-gray-600">{bio}</p>
    </div>
  </div>
);

const TeamPage = () => {
  // Mock team data - replace with actual team information
  const teamMembers = [
    {
      id: 1,
      name: "Samruddhi Sathwane",
      role: "Project Lead & ML Engineer",
      // bio: "John has over 5 years of experience in machine learning and audio processing. He led the development of the stress detection algorithm used in this project.",
      imageUrl: "https://via.placeholder.com/400x300?text=John+Smith"
    },
    {
      id: 2,
      name: "Shreya Mate",
      role: "Frontend Developer",
      // bio: "Sarah specializes in React and modern web technologies. She designed and implemented the user interface for the stress detection application.",
      imageUrl: "https://via.placeholder.com/400x300?text=Sarah+Johnson"
    },
    {
      id: 3,
      name: "Nikhil Nandanwar",
      role: "Audio Processing Specialist",
      // bio: "Michael has a background in signal processing and audio analysis. He developed the core audio processing algorithms for stress detection.",
      imageUrl: "https://via.placeholder.com/400x300?text=Michael+Chen"
    },
    {
      id: 4,
      name: "Pranav Gambhire",
      role: "UX Designer",
      // bio: "Emily focused on creating an intuitive and accessible user experience for the stress detection application, ensuring it's easy to use for all users.",
      imageUrl: "https://via.placeholder.com/400x300?text=Emily+Rodriguez"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the talented individuals behind this stress detection project. Our diverse team combines expertise in machine learning, audio processing, and user experience design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <TeamMember
              key={member.id}
              name={member.name}
              role={member.role}
              bio={member.bio}
              imageUrl={member.imageUrl}
            />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Project</h2>
          <p className="text-gray-600 mb-4">
            This stress detection application was developed to help identify stress levels through audio analysis. The project combines advanced machine learning techniques with user-friendly interfaces to provide valuable insights into stress patterns.
          </p>
          <p className="text-gray-600">
            Our team worked collaboratively to create a solution that is both technically sophisticated and accessible to users. We believe in the power of technology to improve mental health awareness and management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage; 