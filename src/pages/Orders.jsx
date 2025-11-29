import React from 'react';

const Orders = () => {
    // Placeholder data - in a real app, this would come from an API
    const orders = [
        { 
            id: 'ORD-12345', 
            date: '2024-03-15', 
            total: 28.98, 
            status: 'Delivered',
            items: [
                { title: 'The Great Gatsby', price: 15.99 },
                { title: '1984', price: 12.99 }
            ]
        },
        { 
            id: 'ORD-67890', 
            date: '2024-03-10', 
            total: 19.99, 
            status: 'Shipped',
            items: [
                { title: 'Dune', price: 19.99 }
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-6 text-sm text-gray-600">
                                    <div>
                                        <p className="font-medium text-gray-900">Order Placed</p>
                                        <p>{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Total</p>
                                        <p>${order.total}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order #</p>
                                        <p>{order.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View Invoice
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                                            </div>
                                            <span className="font-medium text-gray-900">{item.title}</span>
                                        </div>
                                        <span className="text-gray-600">${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
