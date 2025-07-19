import React, { useEffect, useState } from 'react';
import { FaBook, FaBookOpen, FaMapMarkerAlt, FaBox, FaUser } from 'react-icons/fa';
import api from '../services/api';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    memberSince: '2023',
    readingPreferences: ['Fiction', 'Science', 'History'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'
  });

  const [orders, setOrders] = useState([
    { 
      id: 1, 
      books: [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 15.99 },
        { title: '1984', author: 'George Orwell', price: 12.99 }
      ],
      date: '2024-03-15', 
      status: 'Delivered',
      total: 28.98
    },
    { 
      id: 2, 
      books: [
        { title: 'Dune', author: 'Frank Herbert', price: 19.99 }
      ],
      date: '2024-03-10', 
      status: 'Shipped',
      total: 19.99
    }
  ]);

  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', addressLine1: '123 Main St', city: 'Boston', state: 'MA', zip: '02108', isDefault: true },
    { id: 2, type: 'Office', addressLine1: '456 Work Ave', city: 'Boston', state: 'MA', zip: '02109', isDefault: false }
  ]);

  const [readingList, setReadingList] = useState([
    { id: 1, title: 'Project Hail Mary', author: 'Andy Weir', progress: 75 },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', progress: 30 }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [draftUser, setDraftUser] = useState(user);

  const handleChange = (field, value) => {
    setDraftUser({ ...draftUser, [field]: value });
  };

  const handleSave = () => {
    setUser(draftUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setDraftUser(user);
    setEditMode(false);
  };

  useEffect(() => {
      // This effect can be used to fetch user data from an API if needed
    // For now, we are using static data
    async function fetchUserProfile() {
      try {  
        let userProfile = await api.get('/users/profile');
        console.log('User Profile:', userProfile.data);
        //setUser(userProfile.data);
        //debugger;
        const requiredProfile = {
          name: userProfile.data.username || 'John Doe',
          email: userProfile.data.email || '',
          phone: '123-456-7890',
          memberSince: '2023',
          readingPreferences: ['Fiction', 'Science', 'History'],
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'
        }
        setUser(requiredProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My BookStore Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">Member since {user.memberSince}</p>
              </div>
              
              <div className="mt-6 space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <FaUser size={20} />
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <FaBox size={20} />
                  Orders
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'addresses' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <FaMapMarkerAlt size={20} />
                  Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('reading')}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'reading' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                >
                  <FaBook size={20} />
                  Reading List
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaUser size={24} />
                    Personal Information
                  </h3>
                  { !editMode ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Name</label>
                          <p className="mt-1 text-gray-900">{user.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Email</label>
                          <p className="mt-1 text-gray-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Phone</label>
                          <p className="mt-1 text-gray-900">{user.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Reading Preferences</label>
                          <div className="mt-2 flex gap-2">
                            {user.readingPreferences.map(pref => (
                              <span key={pref} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDraftUser(user);
                          setEditMode(true);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Name</label>
                          <input
                            type="text"
                            value={draftUser.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Email</label>
                          <input
                            type="email"
                            value={draftUser.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Phone</label>
                          <input
                            type="text"
                            value={draftUser.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="mt-1 block w-full border rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaBox size={24} />
                    Order History
                  </h3>
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm text-gray-600">Order #{order.id}</span>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.books.map((book, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-gray-600">{book.author}</p>
                              </div>
                              <p className="text-gray-900">${book.price}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total</span>
                            <span className="font-medium">${order.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt size={24} />
                    Saved Addresses
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{address.type}</span>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{address.addressLine1}</p>
                        <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reading' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaBookOpen size={24} />
                    Current Reading List
                  </h3>
                  <div className="space-y-4">
                    {readingList.map(book => (
                      <div key={book.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{book.title}</h4>
                            <p className="text-sm text-gray-600">{book.author}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${book.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{book.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;