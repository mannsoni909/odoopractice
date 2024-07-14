// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import { UserContext } from '../contexts/UserContext';

// const Header = () => {
//   const { user, logout, loading, setLoading } = useContext(AuthContext);
//   const { userDetails, fetchUser } = useContext(UserContext);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleSignout = () => {
//     setLoading(true);
//     logout(user);
//     setIsDropdownOpen(false);
//     setTimeout(() => {
//       setLoading(false);
//       navigate('/');
//     }, 800);
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white border-gray-200 dark:bg-gray-900 z-50">
//       <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
//         <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
//           <img src="https://i.pinimg.com/736x/94/8e/40/948e40b16ed74e2a8032f43efde994c3.jpg" className="h-8" alt="Flowbite Logo" />
//           <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Odoo</span>
//         </a>
//         <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//           <button
//             type="button"
//             className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
//             id="user-menu-button"
//             aria-expanded={isDropdownOpen}
//             onClick={toggleDropdown}
//           >
//             <span className="sr-only">Open user menu</span>
//             <img
//               className="w-8 h-8 rounded-full"
//               src="/docs/images/people/profile-picture-3.jpg"
//               alt="user photo"
//             />
//           </button>
//           {/* Dropdown menu */}
//           {isDropdownOpen && (
//             <div
//               ref={dropdownRef}
//               className="absolute right-0 mt-48 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-50"
//               id="user-dropdown"
//             >
//               <div className="px-4 py-3">
//                 <span className="block text-lg text-gray-900 dark:text-white">{userDetails.username}</span>
//                 {/* <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
//                   {userDetails.email}
//                 </span> */}
//               </div>
//               <ul className="py-2" aria-labelledby="user-menu-button">
//                 <li>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                   >
//                     Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <p
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                     onClick={handleSignout}
//                   >
//                     Sign out
//                   </p>
//                 </li>
//               </ul>
//             </div>
//           )}
//           <button
//             data-collapse-toggle="navbar-user"
//             type="button"
//             className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//             aria-controls="navbar-user"
//             aria-expanded="false"
//           >
//             <span className="sr-only">Open main menu</span>
//             <svg
//               className="w-5 h-5"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 17 14"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M1 1h15M1 7h15M1 13h15"
//               />
//             </svg>
//           </button>
//         </div>
//         <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
//           <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//             <li>
//               <Link
//                 to="/home"
//                 className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
//                 aria-current="page"
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/about"
//                 className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
//               >
//                 About
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/contact"
//                 className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
//               >
//                 Contact
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/products"
//                 className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
//               >
//                 Products
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Header;


import { React, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { AuthContext } from '../contexts/AuthContext';

function Header() {

    const [menutoggle, setMenutoggle] = useState(false)
    const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)

    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }

    const showAlert = () =>{
      return isLoggedIn ? '' : alert('Please Login First') 
    } 

    return (
        <div className="header">
            <div className="logo-nav">
            <Link to='/home'>
                <a href="#home" className='text-orange-700'>ELITE LIBRARY</a>
            </Link>
            </div>
            <div className='nav-right'>
                
                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option text-orange-600" onClick={() => { closeMenu() }}>
                        <Link to='/'>
                            <a href="#home">Home</a>
                        </Link>
                    </li>
                    <li className="option text-orange-600" onClick={() => { closeMenu() }}>
                        {
                          isLoggedIn ? (<Link onClick={()=>{ showAlert()}} to='/profile'>
                            <a href="#books">Profile</a>
                            </Link>) : (<Link onClick={()=>{ showAlert()}} to='/login' >
                        <a href="#books">Profile</a>
                        </Link>)
                        }
                    </li>
                    <li className="option text-orange-600" onClick={() => { closeMenu() }}>
                        {
                          isLoggedIn ? (<Link to='/'>
                          <a href='signin' onClick={()=>setIsLoggedIn(false)}>SignOut</a>
                          </Link>) : (<Link to='/login'>
                        <a href='signin'>SignIn</a>
                        </Link>)
                        }
                    </li>
                </ul>
            </div>

            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>
        </div>
    )
}

export default Header