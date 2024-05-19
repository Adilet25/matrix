import "../src/App.css";
import MainLayout from "./components/MainLayout/MainLayout";
import MainRoutes from "./MainRoutes";

const App = () => {
  return (
    <div className="maindiv">
      <MainLayout>
        <MainRoutes />
      </MainLayout>
    </div>
  );
};

export default App;
