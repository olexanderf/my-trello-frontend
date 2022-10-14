import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Board from './pages/Board/Board';
import './App.css';
import Home from './pages/Home/Home';

function App(): JSX.Element {
  return (
    <div className="App">
      <div>
        <Link to="/">Home </Link>
        <Link to="/board">to Board </Link>
        <Link to="/registration">Registration </Link>
      </div>
      <Routes>
        <Route path="/board/:board_id" element={<Board />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
