import React, { useState } from 'react';
import axios from 'axios';

function AddLibrarian() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/librarians', formData);
            alert('Librarian added successfully!');
            setFormData({
                username: '',
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('There was an error adding the librarian:', error);
            alert('Failed to add librarian. Please try again.');
        }
    };

    return (
        <div className="p-6 mt-16 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Add Librarian</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username:</label>
                    <input
                        className="mt-1 p-2 w-full border rounded"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        className="mt-1 p-2 w-full border rounded"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password:</label>
                    <input
                        className="mt-1 p-2 w-full border rounded"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-800">
                    Add Librarian
                </button>
            </form>
        </div>
    );
}

export default AddLibrarian;
