
import { React, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { AuthContext } from '../contexts/AuthContext';

function Header() {

    const [menutoggle, setMenutoggle] = useState(false)
    const {isLoggedIn,setIsLoggedIn} = useContext(AuthContext)
    const navigate = useNavigate()

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
                          <a href='signin' onClick={()=>{setIsLoggedIn(false);navigate('/')}}>SignOut</a>
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