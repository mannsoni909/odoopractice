import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import './App.css';
import './index.css'
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
