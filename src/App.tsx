import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages/MainPage/MainPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { movieQueryOptions } from "./apis/movie";
import Layout from "./components/Layout/Layout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
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
