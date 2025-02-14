import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import EditPage from './pages/Edit';
import Navbar from './components/Navbar';
import './index.scss'

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit/:userId" element={<EditPage />} />
      </Routes>
    </Router>
  );
};

export default App;