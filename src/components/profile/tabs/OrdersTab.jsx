import { FaBox } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';
import { STATUS_STYLES } from '../constants';

export default function OrdersTab({ orders }) {
  return (
    <div>
      <SectionTitle icon={<FaBox />} title="Order History" />
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaBox className="mx-auto text-4xl mb-3 opacity-30" />
          <p className="text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-5
              hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${STATUS_STYLES[order.status] ?? 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                  {order.status}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {order.books.map((book, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{book.title}</p>
                      <p className="text-xs text-gray-400">{book.author}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">${book.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {order.books.length} item{order.books.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Total:</span>
                  <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
