import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [editableRowId, setEditableRowId] = useState(null); // State for tracking which row is being edited
  const [statusToEdit, setStatusToEdit] = useState(''); // State for the new status value
  const recordsPerPage = 10;
  const [statuses, setStatuses] = useState([])

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
          matchesDate = requestDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          matchesDate = requestDate.toDateString() === yesterday.toDateString();
          break;
        case 'thisMonth':
          matchesDate = requestDate.getMonth() === today.getMonth() &&
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

  const openSlider = (request) => {
    setSelectedRequest(request);
    setIsSliderVisible(true);
  };

  const closeSlider = () => {
    setIsSliderVisible(false);
    setSelectedRequest(null);
    setEditableRowId(null); // Reset editable row ID when closing slider
  };

  const handleStatusChange = (id, newStatus) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    };

    fetch(`https://irequest.rumlyn.com/api/v1/processed-requests/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.msg === 'success') {
          const updatedRequests = requests.map((request) =>
            request._id === id ? { ...request, status: newStatus } : request
          );
          setRequests(updatedRequests);
          setFilteredRequests(updatedRequests);
          toast.success("Status updated successfully"); // Notify success
        } else {
          toast.error("Failed to update status"); // Notify error
        }
        setEditableRowId(null); // Reset editable row ID after update
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update status"); // Notify error
      });
  };

  // custom status
  // const 

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Requests Report', 14, 22);

    const tableData = requests.map((request) => [
      request.requestCode,
      request.student_id,
      request.status ? 'Completed' : 'Pending',
      new Date(request.dateCreated).toLocaleString(),
      new Date(request.dateUpdated).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [['Request Code', 'Student ID', 'Status', 'Date Created', 'Date Updated']],
      body: tableData,
      startY: 30,
    });

    doc.save('requests_report.pdf');
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRequests.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRequests.length / recordsPerPage);

  // Slider animation
  const slideIn = useSpring({
    transform: isSliderVisible ? 'translateX(0)' : 'translateX(100%)',
  });

  return (
    <div className="min-h-screen py-8 px-4 md:px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl text-gray-800">Requests</h2>
        <button
          onClick={downloadReport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaDownload className="mr-2" />
          Download Report
        </button>
      </div>
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
                <td className="py-3 px-6">
                  {/* {editableRowId === request._id ? (
                    <select
                      value={statusToEdit}
                      onChange={(e) => setStatusToEdit(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  ) : (
                    (request.status ? 'Completed' : 'Pending')
                  )} */}
                  <select name="" id="">
                    <option value="">Complete</option>
                    <option value="">Pending</option>
                    <option value="">Processing</option>
                  </select>
                </td>
                <td className="py-3 px-6">{new Date(request.dateCreated).toLocaleString()}</td>
                <td className="py-3 px-6">{new Date(request.dateUpdated).toLocaleString()}</td>
                <td className="py-3 px-6 text-center space-x-2 flex items-center">
                  {editableRowId === request._id ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(request._id, statusToEdit)}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditableRowId(null)}
                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditableRowId(request._id);
                          setStatusToEdit(request.status ? 'Completed' : 'Pending');
                        }}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
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

      {/* Slider for viewing request details */}
      {selectedRequest && (
        <animated.div
          style={{
            ...slideIn,
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            zIndex: 1000,
            borderLeft: '1px solid #e2e8f0',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={closeSlider}
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded"
          >
            Close
          </button>
          <h2 className="text-xl font-bold mb-4">Request Details</h2>
          <div className="mb-4">
            <p><strong className="font-semibold">Request Code:</strong> {selectedRequest.requestCode}</p>
            <p><strong className="font-semibold">Student ID:</strong> {selectedRequest.student_id}</p>
            <p><strong className="font-semibold">Status:</strong> {selectedRequest.status ? 'Completed' : 'Pending'}</p>
            <p><strong className="font-semibold">Date Created:</strong> {new Date(selectedRequest.dateCreated).toLocaleString()}</p>
            <p><strong className="font-semibold">Date Updated:</strong> {new Date(selectedRequest.dateUpdated).toLocaleString()}</p>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Requests;
