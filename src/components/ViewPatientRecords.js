import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UploadEHR from "../build/contracts/UploadEhr.json";
import { useNavigate, useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewPatientRecords = () => {
  const { hhNumber } = useParams(); // ✅ Extract `hhNumber` properly
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = UploadEHR.networks[networkId];
          if (deployedNetwork) {
            const contractInstance = new web3Instance.eth.Contract(
              UploadEHR.abi,
              deployedNetwork.address
            );
            setContract(contractInstance);
          } else {
            console.error("Smart contract not deployed on this network.");
          }
        } catch (error) {
          console.error("User denied account access.");
        }
      } else {
        console.log("Please install MetaMask.");
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (contract && hhNumber) {
      fetchRecords();
    }
  }, [contract, hhNumber]); // ✅ Only fetch when both are available

  const fetchRecords = async () => {
    if (!hhNumber) {
      alert("Invalid HH Number!");
      return;
    }

    try {
      const recordsData = await contract.methods.getMyRecords(hhNumber).call();
      setRecords(recordsData);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Failed to retrieve records.");
    }
  };

  useEffect(() => {
    console.log("Updated records:", records); // ✅ Logs after state update
  }, [records]); // ✅ Logs when `records` is updated

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
        <p className="text-center text-2xl">My Medical Records</p>
        <div className="max-w-lg mx-auto mt-6 p-6 bg-gray-900 rounded-lg shadow-lg">
          {records.length > 0 ? (
            <div className="mt-4">
              <p className="text-lg text-green-400">Uploaded Records:</p>
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
                      {new Date(record.timestamp * 1000).toLocaleString()} )
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-400">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatientRecords;
