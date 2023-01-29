import React, { ReactElement, useEffect, useState } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast, ToastContent } from 'react-toastify';
import { useSelector } from 'react-redux';
import { AppState } from './store/store';
import Board from './pages/Board/Board';
import './App.css';
import Home from './pages/Home/Home';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from './pages/Multipurpose/ProgressBar/ProgressBar';
import CardModal from './pages/Board/components/CardModal/cardModal';

function App(): ReactElement {
  const errorMessage = useSelector((store: AppState) => store.errorMessage);
  const loaderBar = useSelector((store: AppState) => store.loaderBar);
  const [loaderBarState, setLoaderBarState] = useState(false);
  const location = useLocation();
  const background = location.state && location.state.background;

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
    setLoaderBarState(loaderBar);
  }, [loaderBar]);

  useEffect(() => {
    if (typeof errorMessage === 'string' && errorMessage !== '') {
      setLoaderBarState(false);
      notify(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className="App">
      <div>
        <Link to="/">Home </Link>
        <Link to="/board">to Board </Link>
        <Link to="/registration">Registration </Link>
      </div>
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/board/:board_id" element={<Board />}>
          <Route path="/board/:board_id/card/:card_id/" element={<CardModal />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/board/:board_id/card/:card_id/" element={<CardModal />} />
        </Routes>
      )}
      {loaderBarState && <ProgressBar />}
      <div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
