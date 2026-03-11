import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

const MainLayoutPage = ({ children }) => {
  return (
    <div>
      <div className="container mx-auto p-4">
        <Navbar />
        <main className="min-h-screen ">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayoutPage;