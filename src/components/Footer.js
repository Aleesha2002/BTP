import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white p-10 ">
      <div className="container">
        <div className="flex justify-between items-start mb-6 mt-6">
          {/* Contact Information */}
          <div className="w-1/3">
            <h3 className="font-bold text-xl mb-2">Contact Information</h3>
            <p>
              <span className="font-bold">Address:</span> GH - 125, ABV-IIITM,
              Gwalior, Madhya Pradesh
            </p>
            <p>
              <span className="font-bold">Phone:</span> +123 456 7890
            </p>
            <p>
              <span className="font-bold">Email:</span> healthify@iiitm.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
