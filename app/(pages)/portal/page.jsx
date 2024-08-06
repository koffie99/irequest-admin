"use client"
import Dashboard from "@/app/screens/Dashboard"
import Requests from "@/app/screens/Requests"
import RequestTypes from "@/app/screens/RequestTypes"
import Image from "next/image"
import React, { useState } from "react"
import { IoPersonCircleSharp } from "react-icons/io5"
import { MdKeyboardArrowDown } from "react-icons/md"

const Portal = () => {
  let adminName
  const [activePage, setActivePage] = useState("Dashboard")

  if (typeof sessionStorage !== "undefined") {
    adminName = sessionStorage.getItem("adminName")
  }

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />
      case "Requests":
        return <Requests />
      case "request-types":
        return <RequestTypes />
      case "Logout":
        return <h1 className="text-2xl font-bold">You have been logged out</h1>
      default:
        return <h1 className="text-2xl font-bold">Welcome to the Portal</h1>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafd] w-full">
      {/* Header */}
      <div className="h-16 bg-[dodgerblue] w-full flex items-center justify-between px-10">
        <Image
          width={100}
          height={100}
          alt="logo"
          src="/images/ilogowhite.png"
        />
        <div className="flex items-center gap-2">
          <p className="text-white">
            {adminName ? adminName.toUpperCase() : "Hello!"}
          </p>
          <IoPersonCircleSharp color="white" size={28} />
          <MdKeyboardArrowDown color="white" size={28} />
        </div>
      </div>

      <div className="h-[1px] w-full bg-[f9fafd]"></div>
      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex-[0.2] bg-[dodgerblue] p-5">
          <ul className="space-y-4 text-white">
            <li
              className={`cursor-pointer ${
                activePage === "Dashboard" ? "font-bold" : ""
              }`}
              onClick={() => setActivePage("Dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`cursor-pointer ${
                activePage === "Requests" ? "font-bold" : ""
              }`}
              onClick={() => setActivePage("Requests")}
            >
              Requests
            </li>
            <li
              className={`cursor-pointer ${
                activePage === "Profile" ? "font-bold" : ""
              }`}
              onClick={() => setActivePage("request-types")}
            >
              Request types
            </li>
            <li
              className={`cursor-pointer ${
                activePage === "Logout" ? "font-bold" : ""
              }`}
              onClick={() => setActivePage("Logout")}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-10 bg-[#f9fafd]">{renderContent()}</div>
      </div>
    </div>
  )
}

export default Portal
