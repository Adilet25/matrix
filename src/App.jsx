import MainLayout from "./components/layout/MainLayout/MainLayoutPage";
import MainRoutes from "./MainRoutes";

function App() {

  return (
    <>
    <div className="maindiv">
      <MainLayout>
        <MainRoutes />
      </MainLayout>
    </div>
    </>
  )
}

export default App
