import React from "react";
import Navbar from "./Navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div className="container mx-auto p-4">
        <Navbar />
        <main className="min-h-screen ">{children}</main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default MainLayout