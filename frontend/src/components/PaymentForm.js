import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [details, setDetails] = useState({ amount: '', name: '', email: '', phone: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/payment', details);
            if(response.data.payment_request && response.data.payment_request.longurl) {
                window.location.href = response.data.payment_request.longurl;
            }
        } catch (error) {
            console.error('Payment Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="amount" placeholder="Amount" onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
            <button type="submit">Pay Now</button>
        </form>
    );
};

export default PaymentForm;
