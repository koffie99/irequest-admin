import React, { useEffect, useState } from 'react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch('https://irequest.rumlyn.com/api/v1/processed-requests/all', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setRequests(result.processed_requests);
        setFilteredRequests(result.processed_requests);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = requests.filter((request) =>
      request.requestCode.toLowerCase().includes(lowercasedQuery) ||
      request.student_id.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredRequests(filteredData);
  }, [searchQuery, requests]);

  return (
    <div className='min-h-screen'>
      <h2 className='font-bold text-lg'>Requests</h2>
      <input
        type='text'
        placeholder='Search by Request Code or Student ID'
        className='mt-4 mb-4 p-2 border w-full'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className='mt-4'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2'>Request Code</th>
              <th className='py-2'>Student ID</th>
              <th className='py-2'>Status</th>
              <th className='py-2'>Date Created</th>
              <th className='py-2'>Date Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request._id}>
                <td className='border px-4 py-2'>{request.requestCode}</td>
                <td className='border px-4 py-2'>{request.student_id}</td>
                <td className='border px-4 py-2'>{request.status ? 'Completed' : 'Pending'}</td>
                <td className='border px-4 py-2'>{new Date(request.dateCreated).toLocaleString()}</td>
                <td className='border px-4 py-2'>{new Date(request.dateUpdated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
