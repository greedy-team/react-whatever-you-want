import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App";
import Briefing from "./pages/Briefing";
import Favorites from "./pages/Favorites";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Briefing /> },
      { path: "favorites", element: <Favorites /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
