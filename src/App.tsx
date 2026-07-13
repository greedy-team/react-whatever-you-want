import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigation,
} from "react-router";
import { AppNavigator } from "./navigation/AppNavigator";
import { SearchScreen } from "./screen/Search/SearchScreen";
import { ListScreen, listLoader } from "./screen/List/ListScreen";
import { ErrorPage } from "./screen/ErrorPage";
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
      { path: "/", element: <SearchScreen />, errorElement: <ErrorPage /> },
      {
        path: "/list",
        element: <ListScreen />,
        loader: listLoader,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
