import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Home from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import Runs from './pages/runs';
import Workouts from './pages/workouts';
import NotFound from './pages/not-found';
import Navbar from './components/navbar/navbar';
import { AppContext } from './lib';
import { Routes, Route, useNavigate } from 'react-router-dom';

export default function App(props) {
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [myRunsNavIsOpen, setMyRunsNavIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('runningfuze-project-jwt');
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    const closeNavRunsMenu = event => {
      if ((event.target.tagName === 'BUTTON' && event.target.textContent === 'My Runs')) return;
      if ((event.target.tagName === 'I' && event.target.classList.contains('fa-solid'))) return;
      setMyRunsNavIsOpen(false);
    };

    document.addEventListener('click', event => {
      closeNavRunsMenu(event);
    });
    return () => document.removeEventListener('click', event => {
      closeNavRunsMenu(event);
    });
  }, []);

  const handleSignIn = result => {
    const { user, token } = result;
    window.localStorage.setItem('runningfuze-project-jwt', token);
    setUser(user);
  };

  const handleSignOut = () => {
    window.localStorage.removeItem('runningfuze-project-jwt');
    setUser(null);
    navigate('/');
  };

  if (isAuthorizing) return null;
  const contextValue = { user, handleSignIn, handleSignOut };

  return (
    <AppContext.Provider value={contextValue}>
      <Navbar myRunsNavIsOpen={myRunsNavIsOpen} setMyRunsNavIsOpen={setMyRunsNavIsOpen}/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home">
          <Route path="activities" element={<Home tab="activities" />} />
          <Route path="progress" element={<Home tab="progress" />} />
          <Route path="profile" element={<Home tab="profile" />} />\
        </Route>
        <Route path="/runs">
          <Route path="upload" element={<Runs mode="add" />} />
          <Route path=":entryId" element={<Runs mode="edit" />} />
        </Route>
        <Route path="/workouts">
          <Route path="" element={<Workouts mode="view" />} />
          <Route path="upload" element={<Workouts mode="add" />} />
          <Route path=":workoutId" element={<Workouts mode="edit" />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppContext.Provider>
  );
}
