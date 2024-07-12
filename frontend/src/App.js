import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import './App.css';
import './index.css'
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Profile from './components/Profile';


function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route element={<Layout/>}>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
          </Route>
      </Routes>
    </Router>
  );
}

export default App;

// console.log("USER FOUND : "+user)