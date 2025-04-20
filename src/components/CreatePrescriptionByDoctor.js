import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";
import DoctorConsultancy from "../build/contracts/DoctorConsultancy.json";

const CreatePrescriptionByDoctor = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [recordId, setRecordId] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [patientHHNumber, setPatientHHNumber] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = DoctorConsultancy.networks[networkId];
        if (!deployedNetwork) {
          setMessage("Smart contract not deployed on current network.");
          return;
        }

        const instance = new web3Instance.eth.Contract(
          DoctorConsultancy.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const accounts = await web3Instance.eth.getAccounts();
        setDoctorAddress(accounts[0]);

        const id = `EHR${uuidv4()}`;
        setRecordId(id);
      } else {
        setMessage("Please install MetaMask.");
      }
    };

    initWeb3();
  }, []);

  const createRecord = async () => {
    if (!patientHHNumber || !patientName || !gender || !diagnosis || !prescription) {
      setMessage("Please fill in all the fields.");
      return;
    }

    try {
      await contract.methods
        .createConsultationRecord(
          recordId,
          patientHHNumber,
          doctorAddress,
          patientName,
          gender,
          diagnosis,
          prescription
        )
        .send({ from: doctorAddress });

      setMessage("Consultation record successfully created!");
      // Clear form
      setPatientName("");
      setGender("");
      setDiagnosis("");
      setPrescription("");
      setPatientHHNumber("");
      setRecordId(`EHR${uuidv4()}`);
    } catch (error) {
      console.error(error);
      setMessage("Error while creating consultation record.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-mono">
      <h2 className="text-3xl font-bold mb-8">Consultancy</h2>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Record Id:</label>
            <input type="text" value={recordId} disabled className="w-full p-2 text-black rounded-md mt-1" />
          </div>
          <div>
            <label>Patient Name:</label>
            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-2 text-black rounded-md mt-1" />
          </div>

          <div>
            <label>Doctor Wallet Address:</label>
            <input type="text" value={doctorAddress} disabled className="w-full p-2 text-black rounded-md mt-1" />
          </div>
          <div>
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 text-black rounded-md mt-1">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-span-1">
            <label>Diagnosis:</label>
            <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full p-2 text-black rounded-md mt-1" rows={3}></textarea>
          </div>
          <div className="col-span-1">
            <label>Prescription:</label>
            <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} className="w-full p-2 text-black rounded-md mt-1" rows={3}></textarea>
          </div>

          <div className="col-span-2">
            <label>Patient HH Number:</label>
            <input type="text" value={patientHHNumber} onChange={(e) => setPatientHHNumber(e.target.value)} placeholder="e.g., HH123456" className="w-full p-2 text-black rounded-md mt-1" />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={createRecord} className="bg-teal-500 hover:bg-teal-700 px-6 py-2 rounded-md">
            Create Record
          </button>
          <button onClick={() => window.history.back()} className="bg-gray-600 hover:bg-gray-800 px-6 py-2 rounded-md">
            Cancel
          </button>
        </div>

        {message && <p className="mt-4 text-yellow-400 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default CreatePrescriptionByDoctor;
