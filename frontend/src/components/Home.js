import { useContext, useEffect} from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Body from './Body';

const Home =() =>{
    const { user,logout,loading,setLoading,ClipLoader } = useContext(AuthContext);
    const {userDetails,fetchUser} = useContext(UserContext)
    const navigate=useNavigate()

    useEffect(()=>{
      fetchUser()
    },[])

    const handleLogout=(user)=>{
        setLoading(true)
        logout(user);
        setTimeout(() => {
            setLoading(false); // Stop the spinner
            navigate('/');
          }, 800);
    }

    return(
        <div  className='mt-16'>
        <Body/>
        </div>
    )
 }

 export default Home;