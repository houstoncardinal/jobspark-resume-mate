import React from 'react';

interface JobSearchProps {
  onJobSelect: (job: any) => void;
  selectedJob?: any;
}

const JobSearchTest = ({ onJobSelect, selectedJob }: JobSearchProps) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Search Test</h2>
      <p className="text-gray-600">This is a test component to verify the import is working.</p>
      <button 
        onClick={() => onJobSelect({ id: 'test', title: 'Test Job' })}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Job Selection
      </button>
    </div>
  );
};

export default JobSearchTest;
