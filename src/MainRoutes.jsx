import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../src/pages/HomePage/HomePage"
import PlaygroundPage from "../src/pages/PlaygroundPage/PlaygroundPage"

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