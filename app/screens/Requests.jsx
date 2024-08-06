import React, { useEffect, useState } from 'react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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
    const filteredData = requests.filter((request) => {
      const matchesQuery =
        request.requestCode.toLowerCase().includes(lowercasedQuery) ||
        request.student_id.toLowerCase().includes(lowercasedQuery);

      const requestDate = new Date(request.dateCreated);
      const today = new Date();
      let matchesDate = true;

      switch (dateFilter) {
        case 'today':
          matchesDate =
            requestDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          matchesDate =
            requestDate.toDateString() === yesterday.toDateString();
          break;
        case 'thisMonth':
          matchesDate =
            requestDate.getMonth() === today.getMonth() &&
            requestDate.getFullYear() === today.getFullYear();
          break;
        case 'thisYear':
          matchesDate = requestDate.getFullYear() === today.getFullYear();
          break;
        case 'lastYear':
          matchesDate = requestDate.getFullYear() === today.getFullYear() - 1;
          break;
        default:
          matchesDate = true;
      }

      return matchesQuery && matchesDate;
    });

    setFilteredRequests(filteredData);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, dateFilter, requests]);

  const handleDelete = (id) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(`https://irequest.rumlyn.com/api/v1/processed-requests/${id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          const updatedRequests = requests.filter((request) => request._id !== id);
          setRequests(updatedRequests);
          setFilteredRequests(updatedRequests);
        } else {
          console.error('Failed to delete the request.');
        }
      })
      .catch((error) => console.error(error));
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRequests.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRequests.length / recordsPerPage);

  return (
    <div className='min-h-screen'>
      <h2 className='font-bold text-lg'>Requests</h2>
      <div className='flex items-center mt-4 mb-4'>
        <input
          type='text'
          placeholder='Search by Request Code or Student ID'
          className='p-2 border w-full'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className='ml-4 p-2 border'
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value=''>All Dates</option>
          <option value='today'>Today</option>
          <option value='yesterday'>Yesterday</option>
          <option value='thisMonth'>This Month</option>
          <option value='thisYear'>This Year</option>
          <option value='lastYear'>Last Year</option>
        </select>
      </div>
      <div className='mt-4'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2'>Request Code</th>
              <th className='py-2'>Student ID</th>
              <th className='py-2'>Status</th>
              <th className='py-2'>Date Created</th>
              <th className='py-2'>Date Updated</th>
              <th className='py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((request) => (
              <tr key={request._id}>
                <td className='border px-4 py-2'>{request.requestCode}</td>
                <td className='border px-4 py-2'>{request.student_id}</td>
                <td className='border px-4 py-2'>{request.status ? 'Completed' : 'Pending'}</td>
                <td className='border px-4 py-2'>{new Date(request.dateCreated).toLocaleString()}</td>
                <td className='border px-4 py-2'>{new Date(request.dateUpdated).toLocaleString()}</td>
                <td className='border px-4 py-2'>
                  <button
                    onClick={() => handleDelete(request._id)}
                    className='bg-red-500 text-white px-3 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4'>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className='mr-2 p-2 bg-gray-200 rounded'
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='p-2 bg-gray-200 rounded'
        >
          Next
        </button>
        <span className='ml-4'>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};

export default Requests;
