import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { BrowserProvider, Contract } from "ethers"; // Ethers v6
import UploadEHR from "../build/contracts/UploadEhr.json";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewPatientByDoctor = () => {
  const { hhNumber } = useParams();
  // console.log(hhNumber)
  const [web3, setWeb3] = useState(null);
  const [ehrContract, setEhrContract] = useState(null);
  const [patientContract, setPatientContract] = useState(null);
  const [patientNumber, setPatientNumber] = useState("");
  const [doctorNumber, setDoctorNumber] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Fix: Set doctor number only when hhNumber changes
  useEffect(() => {
    setDoctorNumber(hhNumber);
  }, [hhNumber]);
  // console.log(doctorNumber);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          // console.log(web3)

          const provider = new BrowserProvider(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          // console.log(networkId);

          const deployedEHR = UploadEHR.networks[networkId];
          const ehrInstance = new web3Instance.eth.Contract(
            UploadEHR.abi,
            deployedEHR && deployedEHR.address
          );
          // console.log(ehrInstance)

          const deployedPatientReg = PatientRegistration.networks[networkId];
          const patientInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedPatientReg && deployedPatientReg.address
          );
          // console.log(patientInstance)

          setEhrContract(ehrInstance);
          setPatientContract(patientInstance);
          // console.log(ehrContract)
          // console.log(patientContract)

          // Fix: Fetch patient list only once
          try {
            const contract = new Contract(
              deployedPatientReg.address,
              PatientRegistration.abi,
              provider
            );
            const patientList = await contract.getPatientList(hhNumber);
            setPatients(patientList);
            //   console.log(patients)
          } catch (error) {
            console.error("Error fetching patient list:", error);
          }
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask.");
      }
    };

    init();
  }, []);

  // Fix: Set patient number when patients list is updated
  useEffect(() => {
    if (patients.length > 0) {
      setPatientNumber(patients[0].patient_number);
    }
  }, [patients]);

  useEffect(() => {
    if (patientNumber) {
      fetchPatientDetails();
    }
  }, [patientNumber]);

  const fetchPatientDetails = async () => {
    if (!patientNumber) {
      alert("Enter HH Number!");
      return;
    }
    // console.log(patientNumber);
    // console.log(doctorNumber);

    try {
      const patient = await patientContract.methods
        .getPatientDetails(patientNumber)
        .call();
      setPatientData({
        name: patient[1],
        dob: patient[2],
        gender: patient[3],
        bloodGroup: patient[4],
        address: patient[5],
        email: patient[6],
      });
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert("Failed to fetch patient details.");
    }
  };

  // const fetchRecords = async () => {
  //   // console.log(patientNumber);
  //   // console.log(doctorNumber);
  //   try {
  //     const records = await ehrContract.methods
  //       .getMedicalRecords(patientNumber, doctorNumber)
  //       .call();
  //     console.log(records);
  //     setRecords(records);
  //   } catch (error) {
  //     console.error("Error fetching records:", error);
  //     alert("Failed to retrieve records.");
  //   }
  // };

  const fetchRecords = async () => {
    if (!ehrContract || !patientNumber || !doctorNumber) {
      alert("Missing required information!");
      return;
    }

    try {
      // Check if doctor already has access
      const hasPermission = await ehrContract.methods
        .isDoctorAuthorized(patientNumber, doctorNumber)
        .call();

      console.log("Doctor Permission:", hasPermission);

      // grant access
      if (!hasPermission) {
        console.log("Granting access to doctor...");
        const accounts = await web3.eth.getAccounts();

        await ehrContract.methods
          .grantDoctorPermission(patientNumber, doctorNumber)
          .send({ from: accounts[0] });

        console.log("Permission granted successfully!");
      }

      // Fetch records
      const records = await ehrContract.methods
        .getMedicalRecords(patientNumber, doctorNumber)
        .call();

      console.log("Fetched Records:", records);
      setRecords(records);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Failed to retrieve records.");
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gray-900 text-white p-10 font-mono">
        <p className="text-center text-2xl">Patient's Profile</p>

        <div className="max-w-xl mx-auto mt-6 p-6 bg-black rounded-lg shadow-lg text-yellow-400">
          {/* fetchPatientDetails() */}
          {patientData && (
            <div className="mt-4">
              <p>
                <strong>Name:</strong>{" "}
                <span className="text-white">{patientData.name}</span>
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                <span className="text-white">{patientData.dob}</span>
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                <span className="text-white">{patientData.gender}</span>
              </p>
              <p>
                <strong>Blood Group:</strong>{" "}
                <span className="text-white">{patientData.bloodGroup}</span>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <span className="text-white">{patientData.address}</span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="text-white">{patientData.email}</span>
              </p>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={fetchRecords}
                  className="p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
                >
                  View Record
                </button>
                <button
                  onClick={() =>
                    navigate("/doctor/" + hhNumber + "/createprescription")
                  }
                  className="p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded">
                  Prescription Consultancy
                </button>
                <button
                  onClick={() =>
                    navigate("/doctor/" + hhNumber + "/patientlist")
                  }
                  className="p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {records.length > 0 && (
            <div className="mt-4">
              <p className="text-lg text-green-400">Patient's Records:</p>
              <ul className="mt-2">
                {records.map((record, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-400"
                    >
                      View Record {index + 1} (Uploaded:{" "}
                      {new Date(record.timestamp * 1000).toLocaleString()})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatientByDoctor;
