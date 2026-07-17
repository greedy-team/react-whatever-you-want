import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { movieQueryOptions } from "./apis/movie";

const queryClient = new QueryClient();

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
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const genre = url.searchParams.get("genre");
          const era = url.searchParams.get("era");

          await queryClient.ensureQueryData(movieQueryOptions(genre, era));

          return null;
        },
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
