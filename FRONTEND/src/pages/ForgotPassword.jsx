import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../config/axiosConfig';
import SignupImg from '../assets/images/signupImg.jpg';
import '../style/style.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 
  const [isSent, setIsSent] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axios.post('/auth/forgot-password', { email });
      toast.success(response.data.message);
      setIsSent(true); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false); 

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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="bg-transparent flex-1 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || isSent} 
              className={`w-full text-white py-2 rounded-md font-bold transition duration-300 ${
                loading
                  ? 'bg-gray-400'
                  : isSent
                  ? 'bg-[#4D4AC1]'
                  : 'bg-[#6E6BDE] hover:bg-[#4D4AC1]'
              }`}
            >
              {loading
                ? 'Sending reset token...'
                : isSent
                ? 'Reset link sent!'
                : 'Send reset link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
