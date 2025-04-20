import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UploadEHR from "../build/contracts/UploadEhr.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const CONTRACT_ADDRESS = "YOUR_SMART_CONTRACT_ADDRESS";
// const PINATA_API_KEY = process.env.PINATA_API_KEY;
// const PINATA_SECRET_API_KEY = process.env.YOUR_PINATA_SECRET_API_KEY;
// console.log(PINATA_API_KEY)
// console.log(PINATA_SECRET_API_KEY)

const PINATA_API_KEY = "";
const PINATA_SECRET_API_KEY = "";
function PatientsUploadRecord() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const [hhNumber, setHhNumber] = useState("");
  const [loading, setLoading] = useState(false);
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
          const contractInstance = new web3Instance.eth.Contract(
            UploadEHR.abi,
            deployedNetwork && deployedNetwork.address
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadToIPFS = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    try {
      // console.log(PINATA_API_KEY)
      // console.log(PINATA_SECRET_API_KEY)
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );

      const ipfsHash = res.data.IpfsHash;
      setIpfsHash(ipfsHash);
      alert("File uploaded to IPFS successfully!");

      await storeHashOnBlockchain(ipfsHash);
    } catch (error) {
      console.error("IPFS Upload Error:", error);
      alert("Failed to upload file to IPFS.");
    }
    setLoading(false);
  };

  const storeHashOnBlockchain = async (ipfsHash) => {
    if (!hhNumber) {
      alert("Enter HH Number!");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .uploadMedicalRecord(hhNumber, ipfsHash)
        .send({ from: accounts[0] });

      alert("Record stored successfully on blockchain!");
    } catch (error) {
      console.error("Blockchain Error:", error);
      alert("Failed to store record on blockchain.");
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono">
        <p className="text-center text-2xl">Upload Record</p>
        <div className="max-w-lg mx-auto mt-6 p-6 bg-gray-900 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Enter Patient HH Number"
            value={hhNumber}
            onChange={(e) => setHhNumber(e.target.value)}
            className="w-full p-2 mb-4 text-black rounded"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 bg-white text-black rounded"
          />
          <button
            onClick={uploadToIPFS}
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload to IPFS"}
          </button>
          {ipfsHash && (
            <p className="mt-4 text-green-400">
              File uploaded! View it on IPFS:{" "}
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View File
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientsUploadRecord;
