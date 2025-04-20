import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div>
    <NavBar></NavBar>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 font-mono">
    <div className="flex space-x-6 mt-[-30px] w-full max-w-2xl mx-auto">
        <button
          className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-300"
          onClick={() => {
            navigate("/doctor_login");
          }}
        >
          Doctor Login
        </button>
        <button
          className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-300"
          onClick={() => {
            navigate("/patient_login");
          }}
        >
          Patient Login
          </button>
        <button
          className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-300"
          onClick={() => {
            navigate("/diagnostic_login");
          }}
        >
          Diagnostic Login
        </button>
      </div>
      </div>
      </div>
  );
};

export default LoginPage;
