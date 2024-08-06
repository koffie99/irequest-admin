import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const RequestTypes = () => {
  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [newRequestType, setNewRequestType] = useState({ name: '', price: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("https://irequest.rumlyn.com/api/v1/requestTypes/all", requestOptions)
      .then(response => response.json())
      .then(result => {
        setRequestTypes(result.request_types);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request type?')) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      fetch(`https://irequest.rumlyn.com/api/v1/requestTypes/delete/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          // Remove the deleted request type from the state
          setRequestTypes(requestTypes.filter(requestType => requestType._id !== id));
        })
        .catch(error => console.error(error));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequestType({ ...newRequestType, [name]: value });
  };

  const handleAddRequestType = () => {
    if (newRequestType.name && newRequestType.price) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(newRequestType);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://irequest.rumlyn.com/api/v1/requestTypes/create", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          setRequestTypes([...requestTypes, { ...newRequestType, _id: Date.now() }]);
          setNewRequestType({ name: '', price: '' });
          setIsSliderVisible(false);
        })
        .catch(error => console.error(error));
    } else {
      setFormError('Please fill in all fields.');
    }
  };

  const slideIn = useSpring({
    transform: isSliderVisible ? 'translateX(0)' : 'translateX(100%)',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Request Types</h2>
        <button
          onClick={() => setIsSliderVisible(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Add Request Type
        </button>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Date Created</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestTypes.map(requestType => (
              <tr key={requestType._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{requestType.name}</td>
                <td className="py-3 px-6">${requestType.price}</td>
                <td className="py-3 px-6">{new Date(requestType.dateCreated).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(requestType._id)}
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

      {/* Slider for adding a new request type */}
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
          onClick={() => setIsSliderVisible(false)}
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Request Type</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={newRequestType.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            name="price"
            value={newRequestType.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddRequestType}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </animated.div>
    </div>
  );
};

export default RequestTypes;
