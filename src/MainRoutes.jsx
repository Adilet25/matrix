import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../src/pages/HomePage/HomePage";
import PlaygroundPage from "../src/pages/PlaygroundPage/PlaygroundPage";
import NewsDetail from "./components/NewsDetail/NewsDetail";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

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
      element: <NewsDetail />,
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
