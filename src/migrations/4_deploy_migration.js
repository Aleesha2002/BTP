const DoctorConsultancy = artifacts.require("DoctorConsultancy");

module.exports = function (deployer) {
  deployer.deploy(DoctorConsultancy);
};
