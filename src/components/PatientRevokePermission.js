// import Web3 from "web3";
// import PatientRegistrationABI from "../abis/PatientRegistration.json"; // adjust path if needed

// const web3 = new Web3(window.ethereum); // make sure MetaMask is connected
// const contractAddress = "YOUR_CONTRACT_ADDRESS"; // replace with your deployed contract address
// const patientRegistration = new web3.eth.Contract(PatientRegistrationABI, contractAddress);

// /**
//  * Revoke permission for a doctor to access patient's records
//  * @param {string} patientNumber - The HH number of the patient
//  * @param {string} doctorNumber - The unique doctor identifier
//  */
// const revokePermission = async (patientNumber, doctorNumber) => {
//   if (!patientNumber || !doctorNumber) {
//     alert("Please provide both patient and doctor numbers.");
//     return;
//   }

//   try {
//     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

//     await patientRegistration.methods
//       .revokePermission(patientNumber, doctorNumber)
//       .send({ from: accounts[0] });

//     alert(`Access revoked successfully for Doctor (${doctorNumber}) on Patient (${patientNumber})`);
//   } catch (error) {
//     console.error("Error revoking permission:", error);
//     alert("Failed to revoke permission. Check console for details.");
//   }
// };

// export default revokePermission;
