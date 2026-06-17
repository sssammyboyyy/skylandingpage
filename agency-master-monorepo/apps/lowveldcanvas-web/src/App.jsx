import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import B2CBlinds from './pages/B2CBlinds';
import B2BTarpaulins from './pages/B2BTarpaulins';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <header className="main-header">
          <div className="container flex justify-between items-center">
            <Link to="/" className="logo">
              <strong>Lowveld Canvas</strong>
            </Link>
            <nav className="main-nav">
              <a href="tel:0137522000" className="btn-secondary">Call 013 752 2000</a>
            </nav>
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/b2c-patio-blinds" element={<B2CBlinds />} />
          <Route path="/b2b-transport-tarpaulins" element={<B2BTarpaulins />} />
        </Routes>
        
        <footer className="main-footer section-padding">
          <div className="container text-center">
            <p>&copy; {new Date().getFullYear()} Lowveld Canvas. All rights reserved.</p>
            <p className="mt-8 text-sm">10 Stinkhout Crescent, Nelspruit, 1200</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
