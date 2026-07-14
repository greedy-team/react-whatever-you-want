import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "result/random",
        element: <ResultPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
