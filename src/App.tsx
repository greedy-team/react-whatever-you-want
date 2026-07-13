import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { AppNavigator } from "./navigation/AppNavigator";
import { SearchScreen } from "./screen/Search/SearchScreen";
import { ListScreen, listLoader } from "./screen/List/ListScreen";
function Layout() {
  return (
    <div className="App">
      <AppNavigator />
      <Outlet />
    </div>
  );
}
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <SearchScreen /> },
      { path: "/list", element: <ListScreen />, loader: listLoader },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
