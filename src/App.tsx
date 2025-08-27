import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateIdCardPage from "./pages/CreateIdCardPage";
import IdCardHeaderPage from "./pages/IdCardHeaderPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateIdCardPage />} />
      <Route path="/id-card" element={<IdCardHeaderPage />} />
    </Routes>
  );
}

export default App;
