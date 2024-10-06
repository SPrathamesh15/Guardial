import { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Signup from './pages/Signup';

import { AuthProvider } from './context/authContext'
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
    </Router>
    <ToastContainer />
    </>
  )
}

function AppWrapper(){
  return (
    <AuthProvider>
        <App />
    </AuthProvider>
    
  )
}
export default AppWrapper

