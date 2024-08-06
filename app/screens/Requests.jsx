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
    <div className="min-h-screen py-8 px-4 md:px-12">
      <h2 className="font-bold text-2xl text-gray-800 mb-6 text-center">Requests</h2>
      <div className="flex items-center justify-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search by Request Code or Student ID"
          className="p-3 w-full max-w-md border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Request Code</th>
              <th className="py-3 px-6 text-left">Student ID</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Date Created</th>
              <th className="py-3 px-6 text-left">Date Updated</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((request) => (
              <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{request.requestCode}</td>
                <td className="py-3 px-6">{request.student_id}</td>
                <td className="py-3 px-6">{request.status ? 'Completed' : 'Pending'}</td>
                <td className="py-3 px-6">{new Date(request.dateCreated).toLocaleString()}</td>
                <td className="py-3 px-6">{new Date(request.dateUpdated).toLocaleString()}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-700 rounded-lg shadow-sm hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Requests;
