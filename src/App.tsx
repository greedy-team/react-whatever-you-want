import React from "react";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { AppNavigator } from "./navigation/AppNavigator";
import { SearchScreen } from "./screen/Search/SearchScreen";
import { ListScreen } from "./screen/List/ListScreen";
function App() {
  return (
    <div className="App">
      <Router>
        <AppNavigator />
        <Routes>
          <Route path="/" element={<SearchScreen />} />
          <Route path="/list" element={<ListScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
