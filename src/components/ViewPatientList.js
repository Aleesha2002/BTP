import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers"; // Ethers v6
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";

const ViewPatientList = () => {
  const { hhNumber } = useParams();
  const [web3, setWeb3] = useState(null);
  const [patients, setPatients] = useState([]);
  const [account, setAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [error, setError] = useState(null);
  const [pcontract, setPContract] = useState([]);

  const navigate = useNavigate();
  const viewRecord = () =>
    navigate(`/doctor/${hhNumber}/viewpatientbydoctor`);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log(signer);
        // console.log(hhNumber)

        // Fetch the correct network ID and contract address
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContractAddress(contractInstance);
        // console.log(accounts[0]);

        // fetchPatientList(hhNumber, provider, deployedNetwork.address);
        try {
          const contract = new Contract(
            deployedNetwork.address,
            PatientRegistration.abi,
            provider
          );
          // console.log(contract);
          const patientList = await contract.getPatientList(hhNumber);
          // console.log(patientList);
          setPatients(patientList);
          // console.log(patients);
        } catch (error) {
          console.error("Error fetching patient list:", error);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("Please install MetaMask");
    }
  }

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
        <p className="text-center text-2xl">Patient List</p>
        <div className="max-w-4xl mx-auto mt-5">
          {/* {patients.map((patient, index) => (console.log(patient)))} */}
          {patients.length > 0 ? (
            <ul className="border border-gray-500 rounded p-4">
              {patients.map((patient, index) => (
                <div className="flex flex-wrap justify-center gap-5 w-full px-4 sm:px-0">
                  <li key={index} className="p-2 border-b border-gray-700">
                    <p>
                      <strong>Patient Number:</strong> {patient.patient_number}
                    </p>
                    <p>
                      <strong>Name:</strong> {patient.patient_name}
                    </p>
                  </li>
                  <button
                    onClick={viewRecord}
                    className="my-3 px-6 sm:px-5 py-6 sm:py-5 w-full sm:w-1/6 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
                  >
                    View
                  </button>
                  {/* <button
                    // onClick={}
                    className="my-3 px-6 sm:px-5 py-6 sm:py-5 w-full sm:w-1/6 rounded-lg bg-teal-500 hover:bg-gray-600 transition-colors duration-300"
                  >
                    Delete
                  </button> */}
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-center">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatientList;
