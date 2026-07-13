import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigation,
} from "react-router";
import { AppNavigator } from "./navigation/AppNavigator";
import { SearchScreen } from "./screen/Search/SearchScreen";
import { ListScreen } from "./screen/List/ListScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function Layout() {
  const navigation = useNavigation();
  return (
    <div className="App">
      <AppNavigator />
      {navigation.state === "loading" && <p>불러오는중</p>}
      <Outlet />
    </div>
  );
}
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <SearchScreen /> },
      {
        path: "/list",
        element: <ListScreen />,
      },
    ],
  },
]);
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
