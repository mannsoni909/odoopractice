import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import './App.css';
import './index.css'
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Body from './components/Body';
import ReadMore from './components/ReadMore';


function App() {
  return (
    <Router>
      <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
          <Route path="/readmore/:id" 
            element={<ReadMore/>} >
          </Route>
          </Route>
      </Routes>
    </Router>
  );
}

export default App;

// console.log("USER FOUND : "+user)