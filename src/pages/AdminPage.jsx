import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
       /*  axios.get('http://192.168.10.6:8080/users/all',{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin'),
            },
            withCredentials: true,
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            }); */
            const fetchUsers = async () => {
                try {
                  const response = await api.get('/users/all');
                  console.log(response.data);
                  setUsers(response.data);
                } catch (error) {
                  console.error('There was an error fetching the users!', error);
                  setError(error.message);
                }
              };
          
              fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{user.name}</td>
                            <td className="py-2 px-4 border-b text-center">{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;