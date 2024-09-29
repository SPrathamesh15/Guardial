import { useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Signup from './pages/Signup';

import { AuthProvider } from './context/authContext'
import Login from './pages/Login';
function App() {

  return (
    
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
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

