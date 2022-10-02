import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Board from './pages/Board/Board';
import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <div>
        <Link to="/board">to Board</Link>
      </div>
      <Routes>
        <Route path="/board" element={<Board />} />
      </Routes>
    </div>
  );
}

export default App;
