import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
// No need to import "./LandingPage.css" if you are using Tailwind CSS classes

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar></NavBar>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 font-mono">
        <div className="flex space-x-6 mt-[-30px] w-full max-w-2xl mx-auto">
          <button
            className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-3400"
            onClick={() => {
              navigate("/doctor_registration");
            }}
          >
            Doctor Registration
          </button>
          <button
            className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-400"
            onClick={() => {
              navigate("/patient_registration");
            }}
          >
            Patient Registration
          </button>
          <button
           className="bg-emerald-500 text-white font-bold py-20 px-4 rounded w-full transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-400"
            onClick={() => {
              navigate("/diagnostic_registration");
            }}
          >
            Diagnostics Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
