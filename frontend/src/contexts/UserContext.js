import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext()

export const UserContextProvider = ({children}) => {
    const [userDetails,setUserDetails] = useState(null)
    const [role,setRole] = useState('No role')
    // const {user} = useContext(AuthContext)

    const fetchUser =async ()=>{
        try{
            const user = JSON.parse(localStorage.getItem('userEmail')).value
        const response = await axios.post("http://localhost:5000/fetchUserDetails",{user})
        console.log(response)
        const data={
            username: response.data.result.username,
            email: response.data.result.email,
            phone: response.data.result.phone,
            address: response.data.result.address,
            profilePic: response.data.result.profilePic 
        }
        setUserDetails(data)
    }
        catch(error){
        }
    }

    return (
        <UserContext.Provider value={{userDetails,setUserDetails,fetchUser,role,setRole}}>
        {children}
        </UserContext.Provider>
    )

}
