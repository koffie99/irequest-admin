import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import {Toaster, toast} from 'react-hot-toast';

const Statuses = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    // Fetch data from the API on component mount
    const fetchData = async () => {
      try {
        const response = await fetch("https://irequest.rumlyn.com/api/v1/statuses/all");
        const result = await response.json();
        if (result.msg === "success") {
          setData(result.statuses.map(status => ({
            id: status._id,
            name: status.name,
            dateCreated: new Date(status.dateCreated).toLocaleDateString(),
            status: "Active" // or adjust based on your needs
          })));
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
        toast.error("Error fetching statuses");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://irequest.rumlyn.com/api/v1/statuses/delete/${id}`, requestOptions);
        const result = await response.json();
        console.log(result);

        // Update the table after deletion
        setData(data.filter(item => item.id !== id));
        toast.success("Status deleted successfully");
      } catch (error) {
        console.error("Error deleting status:", error);
        toast.error("Error deleting status");
      }
    }
  };

  const handleAddStatus = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ name: newStatus });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://irequest.rumlyn.com/api/v1/statuses/create", requestOptions);
      const result = await response.json();
      console.log(result);

      // Update the table with new status
      setData([
        ...data,
        {
          id: result.status._id,
          name: result.status.name,
          dateCreated: new Date(result.status.dateCreated).toLocaleDateString(),
          status: "Active" // or another status based on your application logic
        }
      ]);

      setNewStatus("");
      setIsOpen(false);
      toast.success("Status added successfully");
    } catch (error) {
      console.error("Error adding status:", error);
      toast.error("Error adding status");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafd] p-4">
      <h2 className="font-bold text-xl mb-4">Statuses</h2>
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add Status
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Status Name</th>
              <th className="p-2 text-left">Date Created</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.dateCreated}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slider for adding new status */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Add New Status</h3>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Status Name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleAddStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 mr-2"
            >
              Add
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Statuses;
