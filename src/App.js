
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchEngine from "./pages/SearchEngine";

function App() {
  return (
    <Router>
      <div className="app-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchEngine />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
