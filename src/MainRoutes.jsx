import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import PlaygroundPage from "./pages/Playground/PlaygroundPage.JSX";
import NewsDetailPage from "./pages/NewsDetail/NewsDetailPage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";


const MainRoutes = () => {
  //! Сюда добавлять ссылки на страницы
  const PUBLIC_PAGES = [
    {
      link: "/",
      element: <HomePage />,
      id: 1,
    },
    {
      link: "/playground",
      element: <PlaygroundPage />,
      id: 2,
    },
    {
      link: "/news/details/:id",
      element: <NewsDetailPage />,
      id: 3,
    },
    {
      link: "/login",
      element: <LoginPage />,
      id: 4,
    },
    {
      link: "/register",
      element: <RegisterPage />,
      id: 5,
    },
  ];

  return (
    <div>
      <Routes>
        {PUBLIC_PAGES.map((item) => (
          <Route path={item.link} element={item.element} key={item.id} />
        ))}
      </Routes>
    </div>
  );
};

export default MainRoutes;