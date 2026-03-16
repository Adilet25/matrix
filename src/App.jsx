import { useEffect, useState } from "react";
import MainLayout from "./components/layout/MainLayout/MainLayoutPage";
import MatrixLoader from "./components/utils/loader/MatrixLoader";
import { useAuth } from "./context/AuthContext";
import MainRoutes from "./MainRoutes";

function App() {
  const { loading } = useAuth();

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return <MatrixLoader fullScreen label="BOOTING MATRIX OS" />;
  }
  return (
    <>
      <div className="maindiv">
        <MainLayout>
          <MainRoutes />
        </MainLayout>
      </div>
    </>
  );
}

export default App;
