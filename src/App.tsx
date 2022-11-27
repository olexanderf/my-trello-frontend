import React, { ReactElement, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { ToastContainer, toast, ToastContent } from 'react-toastify';
import { useSelector } from 'react-redux';
import { AppState } from './store/store';
import Board from './pages/Board/Board';
import './App.css';
import Home from './pages/Home/Home';
import 'react-toastify/dist/ReactToastify.css';

function App(): ReactElement {
  const errorMessage = useSelector((store: AppState) => store.errorMessage);

  const notify = (message: string): ToastContent =>
    toast.error(`${message}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  useEffect(() => {
    // console.log('useEffect');
    if (typeof errorMessage === 'string' && errorMessage !== '') {
      notify(errorMessage);
    }
  });
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
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
