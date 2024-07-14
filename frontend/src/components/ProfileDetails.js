import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';

function ProfileDetails() {
    const { userDetails, fetchUser } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        profilePic: ''
    });
    const [profilePicPreview, setProfilePicPreview] = useState('');
    const CLOUDINARY_URL= 'https://res.cloudinary.com/dwrnhptyt/image/upload/v1720894434/'

    const preset_key ="profile"
    const cloud_name ="dwrnhptyt"

    // useEffect(() => {
    //     handleOnRender()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // const handleOnRender = async()=>{
    //     await fetchUser();
    //     console.log("USERS FETCHED BY FETCHUSER")
    //     handleFormEditing();
    // }

    const handleFormEditing = async () => {
        console.log("HANDLE FORM EDITING CALLED ")
        if (userDetails) {
            console.log('userDetails')
            console.log(userDetails)
            setFormData(userDetails);
            console.log(formData)
            setProfilePicPreview(userDetails.profilePic)
        }
    };

    if (!userDetails) return <div className="p-6 max-w-md mx-auto text-center">Please Login</div>;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        // const fileExtension = file.name.split('.').pop()

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', preset_key)
        formData.append('cloud_name', cloud_name)

        console.log("CALLING CLOUDINARY API")

        try{
        const response = await axios.post('https://api.cloudinary.com/v1_1/dwrnhptyt/image/upload',formData)

        console.log(response)
        // setProfilePicPreview(imageUrl)
        const imageUrl = response.data.secure_url;
        // const publicId = response.data.public_id+"."+fileExtension;


        setFormData({
            ...formData,
            profilePic: imageUrl
        });
        
        setProfilePicPreview(imageUrl);
        setProfile(imageUrl)
        console.log(imageUrl)
        // console.log(publicId)

    //     setFormData({
    //         ...formData,
    //         profilePic: imageUrl
    //     });
    }
    catch(err){
        console.log(err)
    }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        const updatedUserDetails ={
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            profilePic: formData.profilePic
        }

        console.log(1000001)
        console.log(profile)
        console.log(updatedUserDetails)
        console.log(formData)
        
        try {
            const response = await axios.post('http://localhost:5000/updateUser', updatedUserDetails);
            if (response.data.message === 'Successful') {
                console.log("Data sent to database");
                fetchUser(); // Refresh user details after update
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
        setIsEditing(false);
    };

    return (
        <div className="p-6 mt-16 max-w-md mx-auto bg-orange-300 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Welcome {userDetails.username}</h2>
            <div className="flex justify-center ">
                <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-orange-700"
                />
            </div>
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username:</label>
                        <input
                            className="mt-1 p-2 w-full border rounded"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email: ( Uneditable )</label>
                        <input
                            className="mt-1 p-2 w-full border rounded"
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone:</label>
                        <input
                            className="mt-1 p-2 w-full border rounded"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address:</label>
                        <input
                            className="mt-1 p-2 w-full border rounded"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture:</label>
                        <input
                            className="mt-1 p-2 w-full border rounded"
                            type="file"
                            name="profilePic"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800">
                            Save
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Phone:</strong> {userDetails.phone}</p>
                    <p><strong>Address:</strong> {userDetails.address}</p>
                    <button onClick={() => { setIsEditing(true); handleFormEditing(); }} className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800">
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileDetails;