import React, { useState, useContext } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaKey } from 'react-icons/fa';
import { HiEye, HiEyeOff, HiRewind } from 'react-icons/hi';
import axios from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SignupImg from '../assets/images/signupImg.jpg';
import { AuthContext } from '../context/authContext';
import '../style/style.css';

function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmpassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setIsSendingOtp(true);
      const response = await axios.post('/auth/register', {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      console.log('register response: ',response);
      toast.success(response.data.message);
      setShowOtpInput(true); 
      setIsSendingOtp(false);
      
    } catch (error) {
      setIsSendingOtp(false);
      toast.error(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/verify', {
        email: form.email,
        otp: form.otp
      });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      console.log('resopnse while verify: ', response);
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSendingOtp(true);
      await axios.post('/auth/register', {
        email: form.email,
        resend_otp: true
      });
      setOtpResent(true);
      toast.success('OTP resent successfully');
      setIsSendingOtp(false);
      setTimer(30);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);  
            setOtpResent(false); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setIsSendingOtp(false);
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9FE]">
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <img
          src={SignupImg} 
          alt="Signup Visual"
          className="w-5/6 h-4/6 rounded-xl transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Right Column - Form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white p-10">
        <div className="w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-[#4D4AC1] mb-8 righteous-regular">Guardial</h1>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={showOtpInput ? handleOtpSubmit : handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            {/* Email */}
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

            {/* Phone Number */}
            <div className="flex items-center bg-gray-100 rounded-md p-2">
              <FaPhone className="text-gray-500 mr-3" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                pattern="\d{10}"
                maxLength="10"
                placeholder="Phone Number"
                required
                className="bg-transparent flex-1 outline-none"
              />
            </div>

            {/* Password */}
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                {showPassword ? <HiEye /> : <HiEyeOff />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex items-center bg-gray-100 rounded-md p-2 relative">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmpassword"
                value={form.confirmpassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="bg-transparent flex-1 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
                {showConfirmPassword ? <HiEye /> : <HiEyeOff />}
              </button>
            </div>

            {/* OTP Input */}
            {showOtpInput && (
              <div className="flex items-center bg-gray-100 rounded-md p-2">
                <FaKey className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                  className="bg-transparent flex-1 outline-none"
                />
              </div>
            )}

            {/* Resend OTP */}
            {showOtpInput && (
              <div className="text-sm text-center mt-2">
                <p>{`Didn't receive the OTP?`}</p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp || otpResent}
                  className="text-blue-500 underline">
                  {isSendingOtp ? 'Sending OTP...' : 'Resend OTP'}
                </button>
                {otpResent && timer > 0 && (
                  <p className="mt-2">{`Resend available in ${timer}s`}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            
            <button
              type="submit"
              className="block w-full text-center py-3 rounded-md bg-[#6E6BDE] text-white font-medium hover:bg-[#4D4AC1] focus:outline-none focus:ring-2 focus:ring-[#4D4AC1] focus:ring-offset-2">
              {showOtpInput ? (isSendingOtp ? 'Sending...' : 'Verify OTP & Register') : (isSendingOtp ? 'Sending...' : 'Send OTP')}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-[#4D4AC1] font-bold hover:underline transition-300">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
