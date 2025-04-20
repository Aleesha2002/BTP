// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DoctorConsultancy {
    struct Consultation {
        string recordId;
        address doctorWallet;
        string patientName;
        string gender;
        string diagnosis;
        string prescription;
        uint256 timestamp;
    }
    
    mapping(string => Consultation[]) private patientConsultations;
    mapping(string => bool) public isRecordCreated;

    event RecordCreated(
        string indexed recordId,
        string indexed patientHHNumber,
        address doctorWallet,
        string patientName,
        string gender,
        string diagnosis,
        string prescription,
        uint256 timestamp
    );

    function createConsultationRecord(
        string memory _recordId,
        string memory _patientHHNumber,
        address _doctorWallet,
        string memory _patientName,
        string memory _gender,
        string memory _diagnosis,
        string memory _prescription
    ) external {
        require(!isRecordCreated[_recordId], "Record with this ID already exists.");

        Consultation memory newRecord = Consultation({
            recordId: _recordId,
            doctorWallet: _doctorWallet,
            patientName: _patientName,
            gender: _gender,
            diagnosis: _diagnosis,
            prescription: _prescription,
            timestamp: block.timestamp
        });

        patientConsultations[_patientHHNumber].push(newRecord);
        isRecordCreated[_recordId] = true;

        emit RecordCreated(
            _recordId,
            _patientHHNumber,
            _doctorWallet,
            _patientName,
            _gender,
            _diagnosis,
            _prescription,
            block.timestamp
        );
    }

    function getMyConsultationRecords(string memory _patientHHNumber)
        external
        view
        returns (Consultation[] memory)
    {
        return patientConsultations[_patientHHNumber];
    }
    
    function getConsultationCount(string memory _patientHHNumber) external view returns (uint256) {
        return patientConsultations[_patientHHNumber].length;
    }
}
