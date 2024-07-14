import React, { useContext } from 'react';
import ProfileDetails from './ProfileDetails';
import MyBooks from './MyBooks';
import { UserContext } from '../contexts/UserContext';
import LibrarianFeatures from './LibrarianFeatures';
import AddLibrarian from './AdminFeatures';

const books = [
    {
        cover: 'cover-image-url-1',
        title: 'Book Title 1',
        author: 'Author 1',
    },
    {
        cover: 'cover-image-url-2',
        title: 'Book Title 2',
        author: 'Author 2',
    },
    // Add more book objects here
];

function Profile() {

    const {role} = useContext(UserContext)

  return (
    <div>
        {
            role==='' ? (<></>) : <div className='mt-16 text-3xl text-center text-slate-800  bg-orange-50 p-5 font-extrabold border-b-2' >
            {role.toUpperCase()}
        </div>
        }
        <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6 p-2 bg-orange-50">
      <div className="w-full md:w-1/3">
        <ProfileDetails />
      </div>
      <div className="w-full md:w-2/3">
        {/* <MyBooks books={books} /> */}
        {
            role === 'user' ? ( <MyBooks books={books}/>) : (role === 'admin') ? (<AddLibrarian/>) : (role==='librarian') ? (<LibrarianFeatures />) : (<></>)
        }
      </div>
    </div>
    </div>
  );
}

export default Profile;
