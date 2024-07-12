import { useContext} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home =() =>{
    const { user,logout,loading,setLoading,ClipLoader } = useContext(AuthContext);
    const navigate=useNavigate()

    const handleLogout=(user)=>{
        setLoading(true)
        logout(user);
        setTimeout(() => {
            setLoading(false); // Stop the spinner
            navigate('/');
          }, 800);
    }

    return(
        <div>
            {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <ClipLoader size={150} color={"#4A90E2"} loading={loading} />
        </div>
      )}
        <h1 className="text-center text-black ">Welcome to Home Page !!</h1>
        {user ? <h1>Email : {user}</h1> : <h1>PLEASE LOGIN FIRST</h1>}
        <button onClick={handleLogout}>LOGOUT</button>
        </div>
    )
 }

 export default Home;