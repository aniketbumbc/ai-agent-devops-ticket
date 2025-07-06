import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckAuth from './components/check-auth';
import Ticket from './pages/ticket';
import Login from './pages/login';
import Signup from './pages/signup';
import Admin from './pages/admin';
import Tickets from './pages/tickets';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <CheckAuth protectedRoute={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        <Route
          path='/tickets/:id'
          element={
            <CheckAuth protectedRoute={true}>
              <Ticket />
            </CheckAuth>
          }
        />

        <Route
          path='/login'
          element={
            <CheckAuth protectedRoute={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path='/signup'
          element={
            <CheckAuth protectedRoute={false}>
              <Signup />
            </CheckAuth>
          }
        />

        <Route
          path='/admin'
          element={
            <CheckAuth protectedRoute={true}>
              <Admin />
            </CheckAuth>
          }
        />

        <Route
          path='/'
          element={
            <CheckAuth protectedRoute={true}>
              <Tickets />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
