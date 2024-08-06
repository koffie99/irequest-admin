import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [successfulCount, setSuccessfulCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch("https://irequest.rumlyn.com/api/v1/requests/all");
        const result = await response.json();
        
        // Set total count
        setTotalCount(result.request_count);

        // Count successful and failed requests
        const successful = result.requests.filter(request => request.status).length;
        const failed = result.requests.length - successful;

        setSuccessfulCount(successful);
        setFailedCount(failed);
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchRequestData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-[#f9fafd] p-4">
      <h2 className="font-bold text-xl">Dashboard</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-9 rounded-lg shadow flex flex-col items-center">
          <h2 className="font-bold text-3xl">{totalCount}</h2>
          <h3 className="text-sm text-[#3a3a3a]">Total Requests</h3>
        </div>
        <div className="bg-white p-9 rounded-lg shadow flex flex-col items-center">
          <h2 className="font-bold text-3xl">{successfulCount}</h2>
          <h3 className="text-sm text-[#3a3a3a]">Successful Requests</h3>
        </div>
        <div className="bg-white p-9 rounded-lg shadow flex flex-col items-center">
          <h2 className="font-bold text-3xl">{failedCount}</h2>
          <h3 className="text-sm text-[#3a3a3a]">Failed Requests</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
