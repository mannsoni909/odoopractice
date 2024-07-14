import axios from 'axios';
import React, { useState,useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you use React Router for navigation
import { z } from 'zod';
// import { ClipLoader } from 'react-spinners';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';


// Define your Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();
  const { user,login,loading,setLoading,ClipLoader,setIsLoggedIn ,isLoggedIn} = useContext(AuthContext);
  const {setRole} = useContext(UserContext)

  
  // if (user){
  //   navigate("/")
  // }

  const handleLogin = async () => {
    try {
      // Validate the form data
      loginSchema.parse({ email, password });

      setLoading(true);
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.data.message === 'Successful') {
        login(email);
        setIsLoggedIn(true)
        
        setRole(response.data.role)
        console.log(isLoggedIn);
        setTimeout(() => {
          setLoading(false); // Stop the spinner
          navigate('/');
        
        }, 800);
      } else {
        setTimeout(() => {
          setLoading(false); // Stop the spinner
        }, 500);
        setError("Invalid Credentials");
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        // Extract the first validation error message
        const firstError = e.errors[0].message;
        setError(firstError);
      } else {
        console.log(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-200">
       {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <ClipLoader size={150} color={"#4A90E2"} loading={loading} />
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Login</h2>
        <div className='text-red-600'>{error}</div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-700 focus:border-orange-700 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-700 focus:border-orange-700 sm:text-sm"
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
          <div>
            <button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 sm:text-sm"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-orange-700 hover:text-orange-500">
              SignUp
            </Link>
          </p>
        </div>
      </div>
      {/* <ClipLoader
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> */}
    </div>
    
  );
};

export default Login;
