import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Briefing from "./pages/Briefing";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Briefing />} />
        <Route path="favorites" element={<Favorites />} />
      </Route>
    </Routes>
  );
}

export default App;
