import { useEffect, useState } from 'react';
import api from '../services/api';

const BookIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const STATUS_BADGE = {
  Delivered:  'bg-[#EAF3DE] text-[#3B6D11]',
  Shipped:    'bg-[#E6F1FB] text-[#185FA5]',
  Processing: 'bg-[#FAEEDA] text-[#854F0B]',
  Pending:    'bg-[#F1EFE8] text-[#5F5E5A]',
};

const STEPS = ['Confirmed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'];
const STEP_INDEX = { Pending: -1, Confirmed: 0, Processing: 1, Shipped: 2, 'Out for delivery': 3, Delivered: 4 };

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

// ── Tracking progress bar ────────────────────────────────────────────────────
function TrackingBar({ status }) {
  const current = STEP_INDEX[status] ?? 0;
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-3">Order progress</p>
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const done   = i <= current;
          const active = i === current + 1;
          return (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              {/* left-half connector */}
              {i > 0 && (
                <div
                  className={`absolute top-[4px] left-0 w-1/2 h-px ${i <= current ? 'bg-[#1D9E75]' : 'bg-gray-200'}`}
                />
              )}
              {/* right-half connector */}
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute top-[4px] right-0 w-1/2 h-px ${i < current ? 'bg-[#1D9E75]' : 'bg-gray-200'}`}
                />
              )}
              <div
                className={`w-2.5 h-2.5 rounded-full z-10 ${
                  done ? 'bg-[#1D9E75]' : active ? 'bg-[#378ADD]' : 'bg-gray-200'
                }`}
              />
              <span
                className={`text-[10px] mt-1.5 text-center leading-tight ${
                  done ? 'text-[#1D9E75]' : active ? 'text-[#378ADD] font-medium' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Invoice modal ────────────────────────────────────────────────────────────
function InvoiceModal({ order, onClose }) {
  return (
    // Overlay is the scroller — modal card is a natural block, nothing gets cut off
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center p-6 py-10">
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Invoice body ── */}
          <div className="px-8 pt-8 pb-6">

            {/* Brand + invoice number */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2.5 text-[18px] font-semibold text-gray-900">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookIcon className="w-4 h-4 text-[#185FA5]" />
                </div>
                BookStore
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">Invoice</p>
                <p className="text-[24px] font-bold text-gray-900 leading-none">INV-{order.id}</p>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8 pb-7 border-b border-gray-100">
              {[
                ['Order date',      fmt(order.orderDate)],
                ['Order #',         `ORD-${order.id}`],
                ['Order status',    order.status],
                ['Payment method',  order.paymentMethod],
                ['Transaction ID',  order.paymentTransactionId ? order.paymentTransactionId : 'N/A'],
                ['Payment status',  order.paymentStatus],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-1">{label}</p>
                  <p className="text-[13px] font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-2">Shipping address</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-900 mb-1">{order.shippingAddress.addressLine1}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {order.shippingAddress.addressLine2}<br />{order.shippingAddress.city}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-2">Billed to</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-900 mb-1">{order.userName}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {order.shippingAddress.email}<br />{order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Items table */}
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.06em] mb-3">Items ordered</p>
            <table className="w-full mb-2">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-[11px] text-gray-400 uppercase tracking-[0.04em] text-left pb-2.5 font-normal w-1/2">Book</th>
                  <th className="text-[11px] text-gray-400 uppercase tracking-[0.04em] text-center pb-2.5 font-normal">Qty</th>
                  <th className="text-[11px] text-gray-400 uppercase tracking-[0.04em] text-right pb-2.5 font-normal">Unit price</th>
                  <th className="text-[11px] text-gray-400 uppercase tracking-[0.04em] text-right pb-2.5 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-3.5 text-[13px] text-gray-900">
                      <div className="font-medium">{item.bookTitle}</div>
                      {item.bookAuthor && (
                        <div className="text-[12px] text-gray-400 mt-0.5">{item.bookAuthor} · Paperback</div>
                      )}
                    </td>
                    <td className="py-3.5 text-[13px] text-[#185FA5] font-semibold text-center">{item.quantity}</td>
                    <td className="py-3.5 text-[13px] text-gray-700 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3.5 text-[13px] text-gray-700 text-right">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mt-5 mb-6">
              <div className="w-60">
                <div className="flex justify-between text-[13px] text-gray-500 py-1.5">
                  <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500 py-1.5">
                  <span>Shipping</span><span>${order.shippingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-500 py-1.5">
                  <span>Tax</span><span>${order.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-[#1D9E75] py-1.5">
                  <span>Discount</span><span>− ${order.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[15px] font-bold text-gray-900 border-t border-gray-200 mt-2 pt-3">
                  <span>Total</span><span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Footer — part of normal flow, never cuts off content ── */}
          <div className="border-t border-gray-100 px-8 py-4 rounded-b-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[13px] text-gray-500">
                Payment status
                <span className="text-[12px] font-semibold bg-[#EAF3DE] text-[#3B6D11] px-2.5 py-1 rounded-md">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-[13px] px-4 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                  onClick={() => window.print()}
                >
                  Download PDF
                </button>
                <button
                  className="text-[13px] px-4 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>
            </div>
            <button
              className="mt-3 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              ← Back to orders
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [open, setOpen]               = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [details, setDetails]         = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchDetails = async () => {
    if (details) return; // already fetched, don't re-fetch
    setLoadingDetails(true);
    try {
      const response = await api.get(`/api/orders/${order.id}`);
      setDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggle = async () => {
    if (!open) await fetchDetails(); // fetch only on opening
    setOpen((v) => !v);
  };

  const handleInvoice = async (e) => {
    e.stopPropagation();
    await fetchDetails();
    setShowInvoice(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        {/* Card header */}
        <div
          className="flex items-center gap-6 px-5 py-4 flex-wrap cursor-pointer select-none"
          //onClick={() => setOpen((v) => !v)}
          onClick={handleToggle}
        >
          <div className="flex gap-8 flex-1 flex-wrap">
            {[
              ['Order placed', fmt(order.orderDate)],
              ['Order #',    `ORD-${order.id}`],
              ['Total',        `$${order.totalAmount.toFixed(2)}`],
              ['Payment',      order.paymentMethod],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[11px] text-gray-400 uppercase tracking-[0.04em]">{label}</span>
                <span className="text-[14px] font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span
              className={`text-[12px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap ${
                STATUS_BADGE[order.status] ?? STATUS_BADGE.Pending
              }`}
            >
              {order.status}
            </span>
            <button
              className="text-[13px] text-[#185FA5] border border-[#93c4f0] rounded-md px-3 py-1 hover:bg-blue-50 whitespace-nowrap"
              onClick={handleInvoice}
            >
              View invoice
            </button>
            <button
              className="text-[13px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1 hover:bg-gray-50"
              onClick={handleToggle}
            >
              Details {open ? '▴' : '▾'}
            </button>
          </div>
        </div>

        {/* Expandable body */}
        {open && (
          <div className="border-t border-gray-200 px-5 py-4">
            {/* Item rows */}
            <div className="mb-4">
              {details.orderItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-2.5 ${
                    i < details.orderItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="flex-1 text-[14px] text-gray-900">{item.bookTitle}</span>
                  <span className="text-[13px] text-gray-500 min-w-[46px]">×{item.quantity}</span>
                  <span className="text-[14px] font-medium text-gray-900">${item.unitPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              {details.shippedDate && (
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Shipped date</div>
                  <div className="text-[13px] font-medium text-gray-900">{fmt(details.shippedDate)}</div>
                </div>
              )}
              {details.status === 'Delivered' ? (
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Delivered on</div>
                  <div className="text-[13px] font-medium text-gray-900">{fmt(details.actualDeliveryDate)}</div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Expected delivery</div>
                  <div className="text-[13px] font-medium text-gray-900">{fmt(details.expectedDeliveryDate)}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Tracking #</div>
                <div className="text-[13px] font-medium text-gray-900">{details.trackingNumber ? details.trackingNumber : 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Subtotal</div>
                <div className="text-[13px] font-medium text-gray-900">${details.subtotal.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Shipping</div>
                <div className="text-[13px] font-medium text-gray-900">${details.shippingAmount.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <div className="text-[11px] text-gray-400 uppercase tracking-[0.04em] mb-1">Payment status</div>
                <div className="text-[13px] font-medium text-gray-900">{details.paymentStatus}</div>
              </div>
            </div>

            <TrackingBar status={details.status} />
          </div>
        )}
      </div>

      {showInvoice && <InvoiceModal order={details} onClose={() => setShowInvoice(false)} />}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
const Orders = () => {
  /* const orders = [
    {
      id: 'ORD-12345',
      date: '2024-03-15',
      total: 28.98,
      subtotal: 28.98,
      shipping: 0.0,
      status: 'Delivered',
      payment: 'UPI',
      transactionId: 'TXN-8812990',
      tracking: 'TRK-9928812',
      shippedDate: '2024-03-18',
      deliveredDate: '2024-03-21',
      address: {
        name: 'Admin User',
        street: '42, MG Road, Bandra West',
        city: 'Mumbai, Maharashtra 400050',
        email: 'admin@email.com',
        phone: '+91 98765 43210',
      },
      items: [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 15.99, qty: 1 },
        { title: '1984',             author: 'George Orwell',       price: 12.99, qty: 1 },
      ],
    },
    {
      id: 'ORD-67890',
      date: '2024-03-10',
      total: 22.49,
      subtotal: 19.99,
      shipping: 2.50,
      status: 'Shipped',
      payment: 'Credit card',
      transactionId: 'TXN-4421190',
      tracking: 'TRK-4421190',
      shippedDate: '2024-03-12',
      expectedDate: '2024-03-16',
      address: {
        name: 'Admin User',
        street: '42, MG Road, Bandra West',
        city: 'Mumbai, Maharashtra 400050',
        email: 'admin@email.com',
        phone: '+91 98765 43210',
      },
      items: [
        { title: 'Dune', author: 'Frank Herbert', price: 19.99, qty: 1 },
      ],
    },
  ]; */
const [orders, setOrders] = useState([]);

useEffect(() => {
  async function fetchOrders() {
    try {
      const response = await api.get('/api/orders');
      if (response.status !== 200) throw new Error('Failed to fetch orders');
      const data = response.data;
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }
  fetchOrders();
}, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <p className="text-[22px] font-medium text-gray-900 mb-6">My orders</p>
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
