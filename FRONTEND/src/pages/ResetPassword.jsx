import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';
import SignupImg from '../assets/images/signupImg.jpg';
import '../style/style.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`/auth/reset-password/${token}`, { password });
      toast.success(response.data.message);
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9FE]">
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img
          src={SignupImg}
          alt="Reset Password Visual"
          className="w-5/6 h-4/6 rounded-xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white p-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-center text-[#4D4AC1] mb-8 righteous-regular">Guardial</h1>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="bg-transparent flex-1 outline-none"
              />
              <span
                className="cursor-pointer text-gray-500 ml-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>

            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6E6BDE] text-white py-2 rounded-md font-bold hover:bg-[#4D4AC1] transition duration-300"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
