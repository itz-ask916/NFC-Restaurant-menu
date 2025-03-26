import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import KitchenDisplay from "./components/KitchenDisplay";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/kitchen" element={<KitchenDisplay />} />
      </Routes>
    </Router>
  );
};

export default App;
