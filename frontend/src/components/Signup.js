import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ClipLoader } from 'react-spinners';

// Define your Zod schema
const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  otp: z.string().min(4, { message: "OTP is required" })
});

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getOtp = async () => {
    try {
      let response = await axios.post('http://localhost:5000/otp', { email });
      // console.log(response)
      setGeneratedOtp(response.data.BEotp);
      setMessage('OTP sent to your email');
    } catch (error) {
      console.log(error)
      setMessage('Error sending OTP');
    }
  };

  const handleSignup = async () => {
    try {
      // Validate the form data
      signupSchema.parse({ email, name, password, otp });
      // console.log("otp"+otp)
      // console.log("genotp"+generatedOtp)
      if (otp !== generatedOtp) {
        setMessage('Invalid OTP');
        return;
      }
      // if (otp !== '0000') {
      //   setMessage('Invalid OTP');
      //   return;
      // }
      setLoading(true)
      let response = await axios.post("http://localhost:5000/signup", { email, name, password });
      console.log(response)
      if (response.data.message === 'Successful') {
        // alert("Signup Successful");
        setTimeout(() => {
          setLoading(false); // Stop the spinner
          navigate('/');
        }, 1000);
      } else {
        setTimeout(() => {
          setLoading(false); // Stop the spinner
        }, 500);
        setMessage('Error during signup');
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Extract the first validation error message
        const firstError = e.errors[0].message;
        setMessage(firstError);
      } else {
        setMessage('Fill all the details');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <ClipLoader size={150} color={"#4A90E2"} loading={loading} />
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Signup</h2>
        <div className='text-red-600'>{message}</div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Name"
            />
          </div>
          <div className='relative'>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="15" height="15">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="15" height="15">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={getOtp}
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
            >
              Get OTP
            </button>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              onClick={handleSignup}
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
