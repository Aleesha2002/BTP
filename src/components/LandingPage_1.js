import React, { useState } from "react";
import NavBar from "./NavBar";

// Assuming you have images in a folder named `images` inside the `src` directory.
import lp_11 from "./lp_11.png";
import lp_10 from "./lp_10.png";
import lp_12 from "./lp_12.png";
import h1 from "../images/h2.jpg";

function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  function onEnter() {
    setIsHovered(true);
  }
  function onLeave() {
    setIsHovered(false);
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans min-h-screen flex items-center justify-center">
        <div
          // className="w-[1400px] h-[450px] mt-[-180px] flex"
          className="w-[1400px] h-[550px] mt-[-100px] flex"
          // onMouseEnter={() => setTimeout(onEnter, 500)}
          // onMouseHover={() => setTimeout(onLeave, 700)}
          // onMouseLeave={() => setTimeout(onLeave, 600)}
        >
          {/* Image */}
          <div className="flex-grow relative overflow-hidden transition-transform duration-10000 ease-in-out transform hover:scale-105">
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity `}
              src={h1}
              alt="Landing page illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
