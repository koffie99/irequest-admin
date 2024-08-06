"use client";
import Dashboard from "@/app/screens/Dashboard";
import Requests from "@/app/screens/Requests";
import RequestTypes from "@/app/screens/RequestTypes";
import Image from "next/image";
import React, { useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

const Portal = () => {
  let adminName;
  const [activePage, setActivePage] = useState("Dashboard");
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to toggle menu visibility on small screens
  const router = useRouter(); // Initialize useRouter

  if (typeof sessionStorage !== "undefined") {
    adminName = sessionStorage.getItem("adminName");
  }

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Requests":
        return <Requests />;
      case "request-types":
        return <RequestTypes />;
      case "Logout":
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold">You have been logged out</h1>
          </div>
        );
      default:
        return <h1 className="text-2xl font-bold">Welcome to the Portal</h1>;
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      router.push("/"); // Redirect to home page
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafd] w-full">
      {/* Header */}
      <div className="h-16 bg-[dodgerblue] w-full flex items-center justify-between px-4 sm:px-10">
        <Image width={100} height={100} alt="logo" src="/images/ilogowhite.png" />
        <div className="flex items-center gap-2 text-white">
          <p className="hidden sm:block">
            {adminName ? adminName.toUpperCase() : "Hello!"}
          </p>
          <IoPersonCircleSharp size={28} />
          <MdKeyboardArrowDown size={28} />
        </div>
        {/* Toggle Button for Sidebar on Small Screens */}
        <button
          className="sm:hidden text-white p-2"
          onClick={() => setIsMenuVisible(!isMenuVisible)}
        >
          {isMenuVisible ? "Close" : "Menu"}
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-20 w-64 bg-[dodgerblue] p-4 md:p-5 h-[100vh] transition-transform duration-300 ${
            isMenuVisible ? "translate-x-0" : "-translate-x-full"
          } sm:relative sm:translate-x-0`}
        >
          <ul className="space-y-4 text-white">
            <li
              className={`cursor-pointer ${activePage === "Dashboard" ? "font-bold" : ""}`}
              onClick={() => {
                setActivePage("Dashboard");
                setIsMenuVisible(false); // Hide menu on click
              }}
            >
              Dashboard
            </li>
            <li
              className={`cursor-pointer ${activePage === "Requests" ? "font-bold" : ""}`}
              onClick={() => {
                setActivePage("Requests");
                setIsMenuVisible(false); // Hide menu on click
              }}
            >
              Requests
            </li>
            <li
              className={`cursor-pointer ${activePage === "request-types" ? "font-bold" : ""}`}
              onClick={() => {
                setActivePage("request-types");
                setIsMenuVisible(false); // Hide menu on click
              }}
            >
              Request Types
            </li>
            <li
              className={`cursor-pointer ${activePage === "Logout" ? "font-bold" : ""}`}
              onClick={() => handleLogout()} // Use handleLogout function
            >
              Logout
            </li>
          </ul>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-10 bg-[#f9fafd]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Portal;
