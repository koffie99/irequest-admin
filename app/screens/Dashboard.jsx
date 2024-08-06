import React from "react"

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f9fafd]">
      <h2 className="font-bold text-xl">Dashboard</h2>
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-white p-9 rounded-lg shadow flex flex-col items-center">
          <h2 className="font-bold text-3xl">3</h2>
          <h3 className="text-sm text-[#3a3a3a]">Requests</h3>
        </div>
        <div className="bg-white p-9 rounded-lg shadow flex flex-col items-center">
          <h2 className="font-bold text-3xl">3</h2>
          <h3 className="text-sm text-[#3a3a3a]">Requests</h3>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
