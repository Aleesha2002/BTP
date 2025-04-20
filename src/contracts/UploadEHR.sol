// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UploadEHR {
    struct MedicalRecord {
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(string => MedicalRecord[]) private patientRecords;
    mapping(string => mapping(string => bool)) private doctorPermissions;

    event MedicalRecordUploaded(string hhNumber, string ipfsHash, uint256 timestamp);
    event DoctorPermissionGranted(string hhNumber, string doctorNumber);
    event DoctorPermissionRevoked(string hhNumber, string doctorNumber);

    // modifier to check for permission
    modifier onlyWithPermission(string memory _hhNumber, string memory _doctorNumber) {
        require(doctorPermissions[_hhNumber][_doctorNumber], "Access denied! Permission required.");
        _;
    }

    // upload record by patient
    function uploadMedicalRecord(string memory _hhNumber, string memory _ipfsHash) external {
        MedicalRecord memory newRecord = MedicalRecord({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp
        });

        patientRecords[_hhNumber].push(newRecord);
        emit MedicalRecordUploaded(_hhNumber, _ipfsHash, block.timestamp);
    }

    // function for viewing records by doctor
    function getMedicalRecords(string memory _hhNumber, string memory _doctorNumber)
        external
        view
        onlyWithPermission(_hhNumber, _doctorNumber)
        returns (MedicalRecord[] memory)
    {
        return patientRecords[_hhNumber];
    }

    // function for patients to view their own records 
    function getMyRecords(string memory _hhNumber) external view returns (MedicalRecord[] memory) {
        return patientRecords[_hhNumber];
    }

    // grant permission function
    function grantDoctorPermission(string memory _hhNumber, string memory _doctorNumber) external {
        doctorPermissions[_hhNumber][_doctorNumber] = true;
        emit DoctorPermissionGranted(_hhNumber, _doctorNumber);
    }

    // revoke permission function
    function revokeDoctorPermission(string memory _hhNumber, string memory _doctorNumber) external {
        // require(doctorPermissions[_hhNumber][_doctorNumber], "No permission to revoke!");
        doctorPermissions[_hhNumber][_doctorNumber] = false;
        emit DoctorPermissionRevoked(_hhNumber, _doctorNumber);
    }

    // check permission for doctor
    function isDoctorAuthorized(string memory _hhNumber, string memory _doctorNumber) external view returns (bool) {
        return doctorPermissions[_hhNumber][_doctorNumber];
    }
}
