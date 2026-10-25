import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import api from '../services/api';

const PENDING_ORDER_KEY = 'pendingOrderId';
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;

// Landing here does not mean the payment went through: only the Stripe
// webhook confirms it, and it can arrive a few seconds after the redirect.
// So we poll the order until its paymentStatus settles.
export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // checking | paid | failed | processing | missing
  const [phase, setPhase] = useState('checking');
  const [order, setOrder] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const orderId = sessionStorage.getItem(PENDING_ORDER_KEY);
    if (!orderId) {
      setPhase('missing');
      return;
    }

    let cancelled = false;
    let timer;
    const startedAt = Date.now();
    setPhase('checking');

    async function poll() {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        if (cancelled) return;

        // A stale pendingOrderId from an earlier checkout shouldn't be shown for this session.
        if (sessionId && data.stripeCheckoutSessionId && data.stripeCheckoutSessionId !== sessionId) {
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          setPhase('missing');
          return;
        }

        setOrder(data);
        if (data.paymentStatus === 'COMPLETED') {
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          setPhase('paid');
          return;
        }
        if (data.paymentStatus === 'FAILED' || data.paymentStatus === 'CANCELLED') {
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          setPhase('failed');
          return;
        }
      } catch (err) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          setPhase('missing');
          return;
        }
        // Otherwise treat it as transient and keep polling.
      }

      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setPhase('processing');
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, attempt]);

  const orderLabel = order?.orderNumber ?? order?.id;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {phase === 'checking' && (
          <>
            <svg className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming your payment…</h2>
            <p className="text-gray-500">This usually takes a few seconds. Please don’t close this page.</p>
          </>
        )}

        {phase === 'paid' && (
          <>
            <StatusIcon className="bg-green-100 text-green-600"><FaCheck /></StatusIcon>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order placed!</h2>
            <p className="text-gray-500 mb-1">Thank you for your purchase.</p>
            <p className="text-sm text-gray-400 mb-6">
              Order <span className="font-semibold text-gray-700">{orderLabel}</span> has been confirmed
              {order?.totalAmount != null && <> · ${Number(order.totalAmount).toFixed(2)} paid</>}.
            </p>
          </>
        )}

        {phase === 'failed' && (
          <>
            <StatusIcon className="bg-red-100 text-red-600"><FaTimes /></StatusIcon>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment failed</h2>
            <p className="text-gray-500 mb-2">
              Your payment for order <span className="font-semibold text-gray-700">{orderLabel}</span> didn’t go through.
            </p>
            {order?.notes && <p className="text-sm text-gray-400 mb-2">{order.notes}</p>}
            <p className="text-sm text-gray-400 mb-6">Your cart is still saved, so you can try again with another card.</p>
          </>
        )}

        {phase === 'processing' && (
          <>
            <StatusIcon className="bg-amber-100 text-amber-600"><FaClock /></StatusIcon>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment is processing</h2>
            <p className="text-gray-500 mb-6">
              We haven’t received confirmation from Stripe yet. Check your orders shortly.
            </p>
          </>
        )}

        {phase === 'missing' && (
          <>
            <StatusIcon className="bg-gray-100 text-gray-500"><FaClock /></StatusIcon>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">We couldn’t find this order here</h2>
            <p className="text-gray-500 mb-6">
              If you completed a payment, it will appear in your orders once it’s confirmed.
            </p>
          </>
        )}

        {phase !== 'checking' && (
          <div className="flex gap-3 justify-center flex-wrap">
            {phase === 'failed' && (
              <PrimaryButton onClick={() => navigate('/checkout')}>Try again</PrimaryButton>
            )}
            {phase === 'processing' && (
              <PrimaryButton onClick={() => setAttempt(a => a + 1)}>Check again</PrimaryButton>
            )}
            {phase !== 'failed' && phase !== 'processing' && (
              <PrimaryButton onClick={() => navigate('/orders')}>View Orders</PrimaryButton>
            )}
            <button
              onClick={() => navigate(phase === 'processing' || phase === 'failed' ? '/orders' : '/')}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {phase === 'processing' || phase === 'failed' ? 'View Orders' : 'Continue Shopping'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ className, children }) {
  return (
    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl ${className}`}>
      {children}
    </div>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      {children}
    </button>
  );
}
