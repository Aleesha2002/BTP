import React, { useEffect, useState } from "react";
import Web3 from "web3";
import NavBar_Logout from "./NavBar_Logout";
import { useParams, useNavigate } from "react-router-dom";
import DoctorConsultancy from "../build/contracts/DoctorConsultancy.json";

const PatientPrescription = () => {
  const { hhNumber } = useParams(); // Patient HH number from URL
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorConsultancy.networks[networkId];
          if (!deployedNetwork) {
            setMessage("DoctorConsultancy contract not deployed on this network.");
            return;
          }

          const contractInstance = new web3Instance.eth.Contract(
            DoctorConsultancy.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          const result = await contractInstance.methods
            .getMyConsultationRecords(hhNumber)
            .call();

          setConsultations(result);
        } catch (error) {
          console.error("Error loading data:", error);
          setMessage("Failed to load consultation data.");
        }
      } else {
        setMessage("Please install MetaMask.");
      }
    };

    loadBlockchainData();
  }, [hhNumber]);

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen p-10 font-mono">
        <h2 className="text-3xl font-bold text-center mb-8">Your Prescriptions</h2>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        {consultations.length === 0 && !message && (
          <p className="text-center text-yellow-300">No prescriptions found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {consultations.map((record, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="mb-2"><span className="font-bold">Record ID:</span> {record.recordId}</p>
              <p className="mb-2"><span className="font-bold">Doctor Wallet:</span> {record.doctorWallet}</p>
              <p className="mb-2"><span className="font-bold">Patient Name:</span> {record.patientName}</p>
              <p className="mb-2"><span className="font-bold">Gender:</span> {record.gender}</p>
              <p className="mb-2"><span className="font-bold">Diagnosis:</span> {record.diagnosis}</p>
              <p className="mb-2"><span className="font-bold">Prescription:</span> {record.prescription}</p>
              <p className="text-sm text-gray-400"><span className="font-semibold">Date:</span> {new Date(record.timestamp * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescription;
