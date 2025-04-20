import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/./AboutUs.css";
import NavBar from "./NavBar";
import hospitalImage from "../images/hospital.png"; // Import the hospital image
import hos1 from "../images/hos1.jpg";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <div className="flex ">
        {/* Left Side */}
        <div className="w-1/2 flex items-center justify-center text-white text-2xl">
          <div className="hospital-image-container">
            <img
              src={hos1} // Use the imported hospital image
              alt="Hospital"
              className="hospital-image"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex bg-gray-900 items-center justify-center text-white text-2xl rounded-lg">
          {/* <div className="flex justify-center items-center">
              <div className="space-y-4"> */}
          {/* Center align the "About Us" heading */}
          <div className="flex flex-col text-custom-blue space-y-2 w-4/5 p-8 bg-gray-800 shadow-lg rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <div className="about-content text-left">
              {" "}
              {/* Left align the content */}
              <h2>Who We Are</h2>
              <p>
                We are a dedicated team of healthcare professionals and
                technologists committed to revolutionizing the way Electronic
                Health Records are managed. Our mission is to provide a secure,
                efficient, and user-friendly platform for managing Electronic
                health records.
              </p>
              <h2>What We Do</h2>
              <p>
                Our EHR management system provides a comprehensive solution for
                Doctors, Patients, and Diagnostic Centers. We leverage the power
                of Ethereum blockchain for secure data storage and smart
                contracts for access control and data management.
              </p>
              <h2>Our Commitment</h2>
              <p>
                We are committed to ensuring the integrity and security of
                patient data. Our system ensures that only authorized users have
                access to patient records. Patients have control over who can
                access their medical records and can grant or revoke access as
                needed.
              </p>
            </div>
          </div>
          {/* </div>
          </div> */}
        </div>
      </div>
      {/* </div> */}

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <div className="flex justify-center">
        <button
          className=" mb-10 bg-teal-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
