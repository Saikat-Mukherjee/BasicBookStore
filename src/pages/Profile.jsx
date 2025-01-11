import React, { useEffect,useState } from 'react';
import api from '../services/api';

const Profile = () => {
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
    };

   /*  const orders = [
        { id: 1, item: 'Book 1', date: '2023-01-01', status: 'Delivered' },
        { id: 2, item: 'Book 2', date: '2023-02-01', status: 'Shipped' },
    ]; */
    //const [user, setUser] = useState({ name: '', email: '', phone: '' });
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);

    /* const addresses = [
        { id: 1, address: '123 Main St, City, Country' },
        { id: 2, address: '456 Another St, City, Country' },
    ]; */

    useEffect(() => {
        //console.log('Profile page loaded');
        const getProfileAddresses = async () => {
            try {
                const response = await api.get('/address/all?userId=f7cbb32b-7069-4ac6-9eb3-2ac650f74d50');
                const addresses = response.data;
                console.log(addresses);
                setAddresses(addresses);
                } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        }

        const getProfileOrders = async () => {
            try {
                const response = await api.get('/order/all?userId=f7cbb32b-7069-4ac6-9eb3-2ac650f74d50');
                const orders = response.data;
                console.log(orders);
                setOrders(orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        getProfileOrders();
        getProfileAddresses();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">User Details</h2>
                <p className="mb-1"><span className="font-medium">Name:</span> {user.name}</p>
                <p className="mb-1"><span className="font-medium">Email:</span> {user.email}</p>
                <p className="mb-1"><span className="font-medium">Phone:</span> {user.phone}</p>
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Orders</h2>
                {orders.length === 0 ? (
          <p className="text-gray-500">No orders available</p>
        ) : (
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order.id} className="p-2 border rounded">
                Order ID: {order.id}, Total: ${order.total}
              </li>
            ))}
          </ul>
        )}
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Saved Addresses</h2>
                    {addresses.length === 0 ? (
                <p className="text-gray-500">No addresses available</p>
            ) : (
                <ul className="space-y-2">
                {addresses.map(address => (
                    <li key={address.id} className="p-2 border rounded">
                    {address.addressLine1}
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
    );
};

export default Profile;