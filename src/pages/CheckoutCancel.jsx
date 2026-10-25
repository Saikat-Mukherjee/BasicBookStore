import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

// Cancelling on Stripe's page is not a payment failure: the order stays PENDING
// until the Stripe session expires, and the cart is left untouched.
export default function CheckoutCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    sessionStorage.removeItem('pendingOrderId');
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <FaTimes />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h2>
        <p className="text-gray-500 mb-1">
          You haven’t been charged{orderId && <> for order <span className="font-semibold text-gray-700">#{orderId}</span></>}.
        </p>
        <p className="text-sm text-gray-400 mb-6">Your cart is still saved whenever you’re ready.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Return to checkout
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
