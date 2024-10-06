import React, { useState, useContext } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast } from 'react-toastify';
import axios from '../config/axiosConfig';
import { useNavigate, NavLink } from 'react-router-dom';
import SignupImg from '../assets/images/signupImg.jpg';
import '../style/style.css';
import {AuthContext} from '../context/authContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { currentUser, login } = useContext(AuthContext)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', form);
      console.log('response', response.data)
      toast.success(response.data.message);

      login(response.data.user, response.data.token)
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9FE]">
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img
          src={SignupImg}
          alt="Login Visual"
          className="w-5/6 h-4/6 rounded-xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white p-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-center text-[#4D4AC1] mb-8 righteous-regular">Guardial</h1>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="bg-transparent flex-1 outline-none"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-md p-2 relative">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="bg-transparent flex-1 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 transform -translate-y-1/2 top-1/2 text-gray-600">
                {showPassword ? <HiEye /> : <HiEyeOff />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#6E6BDE] text-white py-2 rounded-md font-bold hover:bg-[#4D4AC1] transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-lg text-center text-gray-600 mt-4">
            <NavLink to="/forgot-password" className="text-[#6E6BDE] hover:text-[#4D4AC1]">Forgot your password?</NavLink>
          </p>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <NavLink to="/signup" className="text-[#4D4AC1] font-bold hover:underline">Sign up here</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
