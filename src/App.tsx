import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import ResultPage from "./pages/ResultPage/ResultPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";

function Layout() {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  );
}

const router =createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children:[
      {
        index:true,element:<MainPage/>,
      },
      {
        path:"result/random",element:<ResultPage/>,
      },
      {
        path:"history", element:<HistoryPage/>
      },
  ],
},
]);

export default function App() {
  return <RouterProvider router={router}/>;
}
