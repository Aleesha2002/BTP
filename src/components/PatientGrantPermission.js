import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientGrantPermission = () => {
  const { hhNumber } = useParams(); // Patient ID from URL
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [doctorNumber, setDoctorNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];

          if (!deployedNetwork) {
            setMessage("Smart contract not deployed on this network.");
            return;
          }

          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          // Fetch Patient Name
          const patientDetails = await contractInstance.methods
            .getPatientDetails(hhNumber)
            .call();
          setPatientName(patientDetails.name);
        } catch (error) {
          console.error("Error initializing Web3:", error);
          setMessage("Failed to connect to blockchain.");
        }
      } else {
        setMessage("Please install MetaMask to use this feature.");
      }
    };

    initWeb3();
  }, [hhNumber]);

  const grantPermission = async () => {
    setMessage("");
    setError("");

    if (!doctorNumber) {
      setMessage("Please enter a valid Doctor ID.");
      return;
    }
    try {
      const accounts = await web3.eth.getAccounts();

      const alreadyGranted = await contract.methods
        .isPermissionGranted(hhNumber, doctorNumber)
        .call();

      await contract.methods
        .grantPermission(hhNumber, doctorNumber, patientName)
        .send({ from: accounts[0] });

      if (alreadyGranted) {
        setMessage(`Access already granted to Doctor ${doctorNumber}.`);
        setIsLoading(false);
        return;
      }

      setMessage(`Permission granted to Doctor ${doctorNumber}!`);
      setDoctorNumber(""); // Reset input field
    } catch (error) {
      console.error("Permission Grant Error:", error);
      setMessage("Permission already granted");
    }
  };

  const revokePermission = async () => {
    setMessage("");
    setError("");

    if (!doctorNumber) {
      setError("Please enter a valid Doctor ID.");
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await web3.eth.getAccounts();

      const granted = await contract.methods
        .isPermissionGranted(hhNumber, doctorNumber)
        .call();

      if (!granted) {
        setError(`No permission exists for Doctor ${doctorNumber}.`);
        setIsLoading(false);
        return;
      }

      await contract.methods
        .revokePermission(hhNumber, doctorNumber)
        .send({ from: accounts[0] });

      setMessage(`Permission revoked for Doctor ${doctorNumber}.`);
      setDoctorNumber("");
    } catch (err) {
      console.error("Revoke Error:", err);
      setError("Failed to revoke permission. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 text-white p-10 font-mono h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6">Manage Permission</h2>

        <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
          <label className="block text-lg mb-2">Doctor's ID:</label>
          <input
            type="text"
            value={doctorNumber}
            onChange={(e) => setDoctorNumber(e.target.value)}
            placeholder="Enter Doctor's HH Number"
            className="w-full p-2 text-black rounded-md"
          />
          {console.log(doctorNumber)}
          <div className="flex gap-4 mt-4">
            <button
              onClick={grantPermission}
              className="flex-1 bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              Grant Access
            </button>
            <button
              onClick={revokePermission}
              className="flex-1 bg-green-600 hover:bg-green-800 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              Revoke Access
            </button>
          </div>

          {message && (
            <p className="mt-4 text-yellow-500 text-center">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientGrantPermission;
