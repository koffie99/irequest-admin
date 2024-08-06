import React from 'react';

const Statuses = () => {
  // Dummy data for the table
  const data = [
    { id: 1, name: "Request A", dateCreated: "2024-08-01", status: "Active" },
    { id: 2, name: "Request B", dateCreated: "2024-08-02", status: "Inactive" },
    { id: 3, name: "Request C", dateCreated: "2024-08-03", status: "Active" },
  ];

  const handleDelete = (id) => {
    // Logic to delete the entry
    console.log("Delete entry with id:", id);
  };

  return (
    <div className="min-h-screen bg-[#f9fafd] p-4">
      <h2 className="font-bold text-xl mb-4">Statuses</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Status Name</th>
              <th className="p-2 text-left">Date Created</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.dateCreated}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statuses;
