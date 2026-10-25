import { useEffect, useRef, useState } from 'react';
import {
  FaMapMarkerAlt, FaHome, FaBriefcase, FaCreditCard,
  FaLock, FaCheck, FaChevronRight, FaChevronLeft,
  FaShoppingBag, FaTruck, FaWallet, FaStripe,
} from 'react-icons/fa';
import api from '../services/api';

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Shipping',  icon: <FaTruck /> },
  { id: 2, label: 'Payment',   icon: <FaCreditCard /> },
  { id: 3, label: 'Review',    icon: <FaShoppingBag /> },
];

const EMPTY_ADDR = {
  type: 'Home', fullName: '', phone: '',
  addressLine1: '', addressLine2: '',
  city: '', state: '', zip: '',
  isDefault: false,
};

const TYPE_ICON = { Home: <FaHome />, Office: <FaBriefcase />, Other: <FaMapMarkerAlt /> };

// Only these methods can be paid through Stripe Checkout on the backend.
// Card details are entered on Stripe's hosted page, never in this app.
const PAY_METHODS = [
  { id: 'CREDIT_CARD',    label: 'Credit Card',    desc: 'Visa, Mastercard, Amex & more', icon: <FaCreditCard />, color: 'text-blue-600' },
  { id: 'DEBIT_CARD',     label: 'Debit Card',     desc: 'Pay directly from your bank',   icon: <FaCreditCard />, color: 'text-indigo-600' },
  { id: 'DIGITAL_WALLET', label: 'Digital Wallet', desc: 'Apple Pay, Google Pay & more',  icon: <FaWallet />,     color: 'text-teal-600' },
];

const PENDING_ORDER_KEY = 'pendingOrderId';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
// crypto.randomUUID only exists in secure contexts (https / localhost),
// so fall back when the dev server is opened over a LAN IP.
function newIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// The backend returns errors as plain text, not JSON.
function apiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  return fallback;
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

/** Progress stepper */
function Stepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done    = step.id < current;
        const active  = step.id === current;
        const upcoming = step.id > current;
        return (
          <div key={step.id} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300 border-2
                  ${done    ? 'bg-blue-600 border-blue-600 text-white'             : ''}
                  ${active  ? 'bg-white border-blue-600 text-blue-600 shadow-md'   : ''}
                  ${upcoming? 'bg-gray-50 border-gray-200 text-gray-400'           : ''}
                `}
              >
                {done ? <FaCheck className="text-xs" /> : <span className="text-sm">{i + 1}</span>}
              </div>
              <span
                className={`mt-1.5 text-xs font-medium whitespace-nowrap
                  ${active ? 'text-blue-600' : done ? 'text-gray-600' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mb-4 transition-colors duration-300
                  ${step.id < current ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Single labelled input */
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', maxLength, className = '', onFocus, onBlur }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800
        focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all ${className}`}
    />
  );
}

/* ───── Saved Address Card ───── */
function AddressCard({ address, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(address)}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150
        ${selected
          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-blue-300'
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-gray-700">
          <span className={selected ? 'text-blue-600' : 'text-gray-400'}>
            {TYPE_ICON[address.type] ?? <FaMapMarkerAlt />}
          </span>
          {address.type}
          {address.isDefault && (
            <span className="text-xs font-medium text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
          ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
          {selected && <FaCheck className="text-white text-xs" />}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-0.5">
        {address.fullName && <p className="font-medium text-gray-800">{address.fullName}</p>}
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.zip}</p>
        {address.phone && <p className="text-gray-400 text-xs">{address.phone}</p>}
      </div>
    </button>
  );
}

/* ───── New Address Form ───── */
function NewAddressForm({ value, onChange }) {
  const set = (field, val) => onChange({ ...value, [field]: val });
  return (
    <div className="space-y-3">
      {/* Type selector */}
      <Field label="Address Type">
        <div className="flex gap-2 flex-wrap">
          {['Home', 'Office', 'Other'].map(t => (
            <button
              type="button"
              key={t}
              onClick={() => set('type', t)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all
                ${value.type === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
            >
              {TYPE_ICON[t] ?? <FaMapMarkerAlt />} {t}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full Name" required>
          <TextInput value={value.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label="Phone">
          <TextInput type="tel" value={value.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address Line 1" required>
            <TextInput value={value.addressLine1} onChange={e => set('addressLine1', e.target.value)} placeholder="Street address or P.O. box" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Address Line 2">
            <TextInput value={value.addressLine2} onChange={e => set('addressLine2', e.target.value)} placeholder="Apartment, suite, unit (optional)" />
          </Field>
        </div>
        <Field label="City" required>
          <TextInput value={value.city} onChange={e => set('city', e.target.value)} placeholder="Boston" />
        </Field>
        <Field label="State" required>
          <TextInput value={value.state} onChange={e => set('state', e.target.value)} placeholder="MA" />
        </Field>
        <Field label="ZIP Code" required>
          <TextInput value={value.zip} onChange={e => set('zip', e.target.value)} placeholder="02108" />
        </Field>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={value.isDefault}
          onChange={e => set('isDefault', e.target.checked)}
          className="w-4 h-4 accent-blue-600 rounded"
        />
        <span className="text-sm text-gray-600">Save as default address</span>
      </label>
    </div>
  );
}

/* ───── Order Summary sidebar / review ───── */
function OrderSummary({ items, subtotal, shipping, total, compact = false }) {
  return (
    <div className={`space-y-3 ${compact ? '' : 'bg-gray-50 rounded-2xl p-5 border border-gray-100'}`}>
      {!compact && (
        <h4 className="font-semibold text-gray-800 mb-1">Order Summary</h4>
      )}
      <div className="divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.bookId} className="flex justify-between items-start py-2.5 gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-12 bg-blue-100 rounded flex items-center justify-center shrink-0">
                <FaShoppingBag className="text-blue-400 text-xs" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 shrink-0">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="pt-2 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN CHECKOUT PAGE
═══════════════════════════════════════════ */
export default function Checkout() {
  const [step, setStep] = useState(1);

  /* ── cart data ── */
  const [cartItems,    setCartItems]    = useState([]);
  const [subtotal,     setSubtotal]     = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [total,        setTotal]        = useState(0);
  const [loadingCart,  setLoadingCart]  = useState(true);
  const [loadError,    setLoadError]    = useState('');
  const [cartId,       setCartId]       = useState(null);
  const [userId,       setUserId]       = useState(null);

  /* ── shipping ── */
  const [savedAddresses,   setSavedAddresses]   = useState([]);
  const [selectedAddress,  setSelectedAddress]  = useState(null);
  const [addingNew,        setAddingNew]        = useState(false);
  const [newAddress,       setNewAddress]       = useState({ ...EMPTY_ADDR });

  /* ── payment ── */
  const [payMethod,         setPayMethod]         = useState('CREDIT_CARD');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [notes,             setNotes]             = useState('');

  /* ── order ── */
  const [placing, setPlacing] = useState(false);
  const [errors,  setErrors]  = useState({});
  // One idempotency key per checkout attempt; reused on retries so the
  // backend returns the existing order instead of creating a duplicate.
  const attemptRef = useRef({ signature: null, key: null });

  /* ── fetch ── */
  useEffect(() => {
    async function load() {
      setLoadingCart(true);
      setLoadError('');
      try {
        const [cartRes, addrRes, profileRes] = await Promise.all([
          api.get('/cart/all'),
          api.get('/address/all'),
          api.get('/users/profile'),
        ]);
        const d = cartRes.data;
        setCartItems(d.items ?? []);
        setSubtotal(d.subtotal ?? 0);
        setShippingCost(d.shippingAmount ?? 0);
        setTotal(d.totalAmount ?? 0);
        setCartId(d.cartId ?? null);

        const profile = profileRes.data;
        setUserId(profile?.id ?? profile?.userId ?? d.userId ?? null);

        const addrs = Array.isArray(addrRes.data) ? addrRes.data : [];
        setSavedAddresses(addrs);
        const def = addrs.find(a => a.isDefault) ?? addrs[0];
        if (def) setSelectedAddress(def);
      } catch (err) {
        setLoadError(apiErrorMessage(err, 'Failed to load your cart. Please try again.'));
      } finally {
        setLoadingCart(false);
      }
    }
    load();
  }, []);

  // The amount Stripe charges is computed by the backend from the cart.
  const finalTotal = total || subtotal + shippingCost;
  const isCard = payMethod === 'CREDIT_CARD' || payMethod === 'DEBIT_CARD';

  /* ── validation ── */
  function validateStep(s) {
    const errs = {};
    if (s === 1) {
      if (!selectedAddress && !addingNew) {
        errs.address = 'Please select or add a shipping address.';
      }
      if (addingNew) {
        if (!newAddress.fullName.trim()) errs.fullName = true;
        if (!newAddress.addressLine1.trim()) errs.addressLine1 = true;
        if (!newAddress.city.trim()) errs.city = true;
        if (!newAddress.state.trim()) errs.state = true;
        if (!newAddress.zip.trim()) errs.zip = true;
        if (Object.keys(errs).length) errs.address = 'Please fill in all required address fields.';
      }
    }
    if (s === 2) {
      if (!PAY_METHODS.some(m => m.id === payMethod)) errs.payMethod = 'Please choose a payment method.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    if (step < 3) setStep(s => s + 1);
  }

  function back() {
    setErrors({});
    setStep(s => s - 1);
  }

  /* ── save new address to API ── */
  async function resolveAddress() {
    if (!addingNew) return selectedAddress;
    const res = await api.post('/address', newAddress);
    if (!res.data?.id) throw new Error('Could not save your shipping address.');
    // Switch to the saved address so a retry doesn't create it again.
    setSavedAddresses(prev => [...prev, res.data]);
    setSelectedAddress(res.data);
    setAddingNew(false);
    return res.data;
  }

  function idempotencyKeyFor(signature) {
    if (attemptRef.current.signature !== signature) {
      attemptRef.current = { signature, key: newIdempotencyKey() };
    }
    return attemptRef.current.key;
  }

  /* ── place order and hand off to Stripe Checkout ── */
  async function placeOrder() {
    if (!validateStep(2)) { setStep(2); return; }
    if (!cartId || cartItems.length === 0) {
      setErrors({ submit: 'Your cart is empty.' });
      return;
    }
    if (!userId) {
      setErrors({ submit: 'Could not load your account. Please refresh and try again.' });
      return;
    }
    setPlacing(true);
    setErrors({});
    try {
      const addr = await resolveAddress();
      const orderItems = cartItems.map(item => ({
        bookId:    item.bookId,
        quantity:  item.quantity,
        unitPrice: item.unitPrice,
      }));
      const trimmedNotes = notes.trim();
      const signature = JSON.stringify([addr.id, payMethod, savePaymentMethod, trimmedNotes, orderItems]);
      const payload = {
        userId,
        shippingAddressId: addr.id,
        orderItems,
        paymentMethod:     payMethod,
        ...(trimmedNotes && { notes: trimmedNotes }),
        idempotencyKey:    idempotencyKeyFor(signature),
        savePaymentMethod: isCard && savePaymentMethod,
        clearCart:         true,
      };
      const { data: order } = await api.post(`/api/orders/from-cart/${cartId}`, payload);
      if (!order?.stripeCheckoutSessionUrl) {
        throw new Error('Payment could not be started. Please try again.');
      }
      // The success page reads this to look the order up after Stripe redirects back.
      sessionStorage.setItem(PENDING_ORDER_KEY, String(order.id));
      window.location.href = order.stripeCheckoutSessionUrl;
    } catch (err) {
      setErrors({ submit: apiErrorMessage(err, err?.message || 'Something went wrong. Please try again.') });
      setPlacing(false);
    }
  }

  /* ─────────────────────────────────────────
     LOADING
  ───────────────────────────────────────── */
  if (loadingCart) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg">
          {loadError}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     MAIN LAYOUT
  ───────────────────────────────────────── */
  const selectedPay = PAY_METHODS.find(m => m.id === payMethod);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Complete your purchase securely
        </p>
      </div>

      {/* Stepper */}
      <Stepper current={step} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left panel (steps) ── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

            {/* ═════ STEP 1 — SHIPPING ═════ */}
            {step === 1 && (
              <div>
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-5">
                  <FaTruck className="text-blue-600" /> Shipping Address
                </h2>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && !addingNew && (
                  <div className="space-y-3 mb-5">
                    {savedAddresses.map(addr => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        selected={selectedAddress?.id === addr.id}
                        onSelect={setSelectedAddress}
                      />
                    ))}
                  </div>
                )}

                {/* Add new toggle */}
                {!addingNew ? (
                  <button
                    type="button"
                    onClick={() => { setAddingNew(true); setSelectedAddress(null); }}
                    className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors mt-1"
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-500 font-bold">+</span>
                    {savedAddresses.length > 0 ? 'Use a different address' : 'Add a shipping address'}
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-gray-700">New Address</p>
                      {savedAddresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setAddingNew(false); setSelectedAddress(savedAddresses.find(a => a.isDefault) ?? savedAddresses[0]); }}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Use saved address
                        </button>
                      )}
                    </div>
                    <NewAddressForm value={newAddress} onChange={setNewAddress} />
                  </div>
                )}

                {errors.address && (
                  <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.address}
                  </p>
                )}

                {/* Delivery */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery</h3>
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-blue-500 bg-blue-50/40">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Standard Shipping</p>
                      <p className="text-xs text-gray-400">5–7 business days</p>
                    </div>
                    <span className={`text-sm font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ═════ STEP 2 — PAYMENT ═════ */}
            {step === 2 && (
              <div>
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-5">
                  <FaCreditCard className="text-blue-600" /> Payment Method
                </h2>

                {/* Method grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                  {PAY_METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all
                        ${payMethod === m.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-500 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                    >
                      <span className={`text-lg ${payMethod === m.id ? 'text-blue-600' : m.color}`}>
                        {m.icon}
                      </span>
                      {m.label}
                      <span className="text-[11px] font-normal text-gray-400 text-center">{m.desc}</span>
                    </button>
                  ))}
                </div>
                {errors.payMethod && <p className="text-xs text-red-500 -mt-4 mb-4">{errors.payMethod}</p>}

                <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <FaStripe className="text-indigo-500 text-3xl shrink-0 -my-1" />
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    After you review your order, you’ll be redirected to Stripe’s secure payment page
                    to enter your {isCard ? 'card' : 'wallet'} details. We never see or store them.
                  </p>
                </div>

                {isCard && (
                  <label className="flex items-center gap-2 cursor-pointer select-none mt-4">
                    <input
                      type="checkbox"
                      checked={savePaymentMethod}
                      onChange={e => setSavePaymentMethod(e.target.checked)}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-600">Save this card for future purchases</span>
                  </label>
                )}

                <div className="mt-5">
                  <Field label="Order notes">
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      placeholder="Anything we should know about your order? (optional)"
                      className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 resize-none
                        focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ═════ STEP 3 — REVIEW ═════ */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-600" /> Review Your Order
                </h2>

                {/* Shipping summary */}
                <div className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Shipping To
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  </div>
                  {(selectedAddress || addingNew) && (() => {
                    const addr = selectedAddress ?? newAddress;
                    return (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {addr.fullName && <p className="font-medium">{addr.fullName}</p>}
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip}</p>
                      </div>
                    );
                  })()}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Standard Shipping</span>
                    <span className="font-medium text-gray-700">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Payment summary */}
                <div className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Payment
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded-lg flex items-center justify-center text-base bg-gray-100">
                      <span className={selectedPay?.color}>{selectedPay?.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{selectedPay?.label}</p>
                      <p className="text-xs text-gray-400">
                        Paid securely on Stripe{isCard && savePaymentMethod ? ' · card will be saved' : ''}
                      </p>
                    </div>
                  </div>
                  {notes.trim() && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 whitespace-pre-line">
                      {notes.trim()}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Items ({cartItems.length})
                  </p>
                  <OrderSummary
                    items={cartItems}
                    subtotal={subtotal}
                    shipping={shippingCost}
                    total={finalTotal}
                    compact
                  />
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                {/* Terms */}
                <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                  By placing this order you agree to our{' '}
                  <span className="text-blue-500 cursor-pointer hover:underline">Terms & Conditions</span>{' '}
                  and{' '}
                  <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className={`flex mt-6 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
              {step > 1 && (
                <button
                  onClick={back}
                  disabled={placing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200
                    text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  <FaChevronLeft className="text-xs" /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={next}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl
                    text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Continue <FaChevronRight className="text-xs" />
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing || cartItems.length === 0}
                  className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl
                    text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Redirecting to Stripe…
                    </>
                  ) : (
                    <><FaLock className="text-xs" /> Pay ${finalTotal.toFixed(2)}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right panel (summary sidebar) ── */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-6">
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shippingCost}
              total={finalTotal}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 justify-center">
              <FaLock className="text-gray-300" />
              Payments processed securely by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
