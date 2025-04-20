const UploadEHR = artifacts.require("UploadEHR");

module.exports = function (deployer) {
  deployer.deploy(UploadEHR);
};
