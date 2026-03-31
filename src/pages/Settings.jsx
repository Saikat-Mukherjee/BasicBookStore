import React, { useState } from 'react';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        promotions: true
    });

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Account Settings</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
                    <p className="text-gray-500 text-sm">Manage how you receive updates and alerts.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive order updates and account alerts via email.</p>
                        </div>
                        <button 
                            onClick={() => handleToggle('email')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive real-time updates on your device.</p>
                        </div>
                        <button 
                            onClick={() => handleToggle('push')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.push ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Marketing & Promotions</p>
                            <p className="text-sm text-gray-500">Receive offers, newsletters, and recommendations.</p>
                        </div>
                        <button 
                            onClick={() => handleToggle('promotions')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.promotions ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.promotions ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Security</h2>
                    <p className="text-gray-500 text-sm">Manage your password and account security.</p>
                </div>
                <div className="p-6">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
