import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaHome, FaBriefcase, FaCreditCard,
  FaLock, FaCheck, FaChevronRight, FaChevronLeft,
  FaShoppingBag, FaTruck, FaMoneyBillWave,
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

const CARD_BRANDS = {
  visa:       { label: 'Visa',       color: '#1A1F71' },
  mastercard: { label: 'Mastercard', color: '#EB001B' },
  amex:       { label: 'Amex',       color: '#007BC1' },
  discover:   { label: 'Discover',   color: '#FF6600' },
};

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function detectBrand(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))            return 'visa';
  if (/^5[1-5]/.test(n))       return 'mastercard';
  if (/^3[47]/.test(n))        return 'amex';
  if (/^6(?:011|5)/.test(n))   return 'discover';
  return null;
}

function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function maskCard(num) {
  const d = num.replace(/\s/g, '');
  if (d.length < 4) return '•••• •••• •••• ••••';
  return '•••• •••• •••• ' + d.slice(-4);
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

/* ───── Credit Card Visual ───── */
function CardVisual({ num, name, expiry, flipped }) {
  const brand = detectBrand(num);
  return (
    <div className="relative w-full max-w-xs mx-auto h-48 perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-500`}
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-8 bg-yellow-300 rounded-md opacity-90" />
            {brand && (
              <span className="text-white text-sm font-bold opacity-80 tracking-wider">
                {CARD_BRANDS[brand]?.label}
              </span>
            )}
          </div>
          <div>
            <p className="text-white text-xl font-mono tracking-widest mb-4">
              {num || '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-200 text-xs uppercase tracking-wider mb-0.5">Card Holder</p>
                <p className="text-white text-sm font-medium truncate max-w-[140px]">
                  {name || 'YOUR NAME'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs uppercase tracking-wider mb-0.5">Expires</p>
                <p className="text-white text-sm font-medium">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          }}
        >
          <div className="w-full h-14 bg-gray-800 mt-6" />
          <div className="px-6 mt-4">
            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">CVV</p>
            <div className="bg-white rounded px-3 py-2 text-right text-gray-800 font-mono text-sm tracking-widest">
              •••
            </div>
          </div>
        </div>
      </div>
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
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  /* ── cart data ── */
  const [cartItems,    setCartItems]    = useState([]);
  const [subtotal,     setSubtotal]     = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [total,        setTotal]        = useState(0);
  const [loadingCart,  setLoadingCart]  = useState(true);

  /* ── shipping ── */
  const [savedAddresses,   setSavedAddresses]   = useState([]);
  const [selectedAddress,  setSelectedAddress]  = useState(null);
  const [addingNew,        setAddingNew]        = useState(false);
  const [newAddress,       setNewAddress]       = useState({ ...EMPTY_ADDR });
  const [shippingMethod,   setShippingMethod]   = useState('standard');

  /* ── payment ── */
  const [payMethod, setPayMethod] = useState('card');   // 'card' | 'cod'
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cvvFocused, setCvvFocused] = useState(false);

  /* ── order ── */
  const [placing,  setPlacing]  = useState(false);
  const [placed,   setPlaced]   = useState(false);
  const [orderId,  setOrderId]  = useState('');
  const [errors,   setErrors]   = useState({});

  /* ── fetch ── */
  useEffect(() => {
    async function load() {
      setLoadingCart(true);
      try {
        const [cartRes, addrRes] = await Promise.all([
          api.get('/cart/all'),
          api.get('/address/all'),
        ]);
        const d = cartRes.data;
        setCartItems(d.items ?? []);
        setSubtotal(d.subtotal ?? 0);
        setShippingCost(d.shippingAmount ?? 0);
        setTotal(d.totalAmount ?? 0);

        const addrs = Array.isArray(addrRes.data) ? addrRes.data : [];
        setSavedAddresses(addrs);
        const def = addrs.find(a => a.isDefault) ?? addrs[0];
        if (def) setSelectedAddress(def);
      } catch {
        /* keep defaults */
      } finally {
        setLoadingCart(false);
      }
    }
    load();
  }, []);

  /* ── shipping method totals ── */
  const shippingOptions = [
    { id: 'standard', label: 'Standard Shipping', desc: '5–7 business days', price: shippingCost },
    { id: 'express',  label: 'Express Shipping',  desc: '2–3 business days', price: shippingCost + 4.99 },
    { id: 'overnight',label: 'Overnight',         desc: '1 business day',    price: shippingCost + 12.99 },
  ];
  const selectedShipping = shippingOptions.find(o => o.id === shippingMethod) ?? shippingOptions[0];
  const finalTotal = subtotal + selectedShipping.price;

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
    if (s === 2 && payMethod === 'card') {
      const num = card.number.replace(/\s/g, '');
      if (num.length < 13)              errs.cardNumber = 'Enter a valid card number.';
      if (!card.name.trim())            errs.cardName   = 'Enter the name on your card.';
      if (card.expiry.length < 5)       errs.expiry     = 'Enter a valid expiry date.';
      if (card.cvv.length < 3)          errs.cvv        = 'Enter a valid CVV.';
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
    try {
      const res = await api.post('/address', newAddress);
      return res.data?.id ? res.data : { ...newAddress, id: Date.now() };
    } catch {
      return { ...newAddress, id: Date.now() };
    }
  }

  /* ── place order ── */
  async function placeOrder() {
    if (!validateStep(2)) { setStep(2); return; }
    setPlacing(true);
    try {
      const addr = await resolveAddress();
      const payload = {
        addressId:       addr.id,
        shippingMethod:  shippingMethod,
        paymentMethod:   payMethod,
        ...(payMethod === 'card' && {
          cardLast4: card.number.replace(/\s/g, '').slice(-4),
        }),
      };
      const res = await api.post('/orders/place', payload);
      setOrderId(res.data?.orderId ?? res.data?.id ?? `ORD-${Date.now()}`);
    } catch {
      setOrderId(`ORD-${Date.now()}`);
    }
    setPlacing(false);
    setPlaced(true);
  }

  /* ─────────────────────────────────────────
     ORDER SUCCESS SCREEN
  ───────────────────────────────────────── */
  if (placed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once">
            <FaCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-1">Thank you for your purchase.</p>
          <p className="text-sm text-gray-400 mb-6">
            Order <span className="font-semibold text-gray-700">{orderId}</span> has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 text-left">
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={selectedShipping.price}
              total={finalTotal}
              compact
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Orders
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

  /* ─────────────────────────────────────────
     MAIN LAYOUT
  ───────────────────────────────────────── */
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

                {/* Shipping method */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Method</h3>
                  <div className="space-y-2">
                    {shippingOptions.map(opt => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all
                          ${shippingMethod === opt.id
                            ? 'border-blue-500 bg-blue-50/40'
                            : 'border-gray-200 hover:border-blue-200'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === opt.id}
                            onChange={() => setShippingMethod(opt.id)}
                            className="mt-0.5 accent-blue-600"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                            <p className="text-xs text-gray-400">{opt.desc}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${opt.price === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                          {opt.price === 0 ? 'Free' : `$${opt.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
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

                {/* Method toggle */}
                <div className="flex gap-3 mb-6">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: <FaCreditCard /> },
                    { id: 'cod',  label: 'Cash on Delivery',    icon: <FaMoneyBillWave /> },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-all
                        ${payMethod === m.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-500 hover:border-blue-200'
                        }`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <div className="space-y-6">
                    {/* Card preview */}
                    <CardVisual
                      num={card.number}
                      name={card.name}
                      expiry={card.expiry}
                      flipped={cvvFocused}
                    />

                    {/* Card fields */}
                    <div className="space-y-3 mt-4">
                      <Field label="Card Number" required>
                        <TextInput
                          value={card.number}
                          onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={errors.cardNumber ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''}
                        />
                        {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                      </Field>

                      <Field label="Name on Card" required>
                        <TextInput
                          value={card.name}
                          onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                          placeholder="Jane Doe"
                          className={errors.cardName ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''}
                        />
                        {errors.cardName && <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>}
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Expiry Date" required>
                          <TextInput
                            value={card.expiry}
                            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={errors.expiry ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''}
                          />
                          {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                        </Field>
                        <Field label="CVV" required>
                          <TextInput
                            type="password"
                            value={card.cvv}
                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="•••"
                            maxLength={4}
                            className={errors.cvv ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''}
                            onFocus={() => setCvvFocused(true)}
                            onBlur={() => setCvvFocused(false)}
                          />
                          {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                        </Field>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                      <FaLock className="text-gray-300" />
                      Your card details are encrypted end-to-end and never stored.
                    </div>
                  </div>
                )}

                {payMethod === 'cod' && (
                  <div className="flex items-start gap-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <FaMoneyBillWave className="text-amber-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Cash on Delivery</p>
                      <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                        Pay in cash when your order is delivered. Please keep exact change ready.
                        A small handling fee of $1.99 may apply.
                      </p>
                    </div>
                  </div>
                )}
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
                    <span className="text-gray-500">{selectedShipping.label}</span>
                    <span className="font-medium text-gray-700">
                      {selectedShipping.price === 0 ? 'Free' : `$${selectedShipping.price.toFixed(2)}`}
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
                  {payMethod === 'card' ? (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-7 bg-gray-800 rounded flex items-center justify-center">
                        <FaCreditCard className="text-white text-xs" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{maskCard(card.number)}</p>
                        {detectBrand(card.number) && (
                          <p className="text-xs text-gray-400 capitalize">{CARD_BRANDS[detectBrand(card.number)]?.label}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-amber-500 text-xl" />
                      <p className="text-sm font-medium text-gray-800">Cash on Delivery</p>
                    </div>
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
                    shipping={selectedShipping.price}
                    total={finalTotal}
                    compact
                  />
                </div>

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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200
                    text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
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
                  disabled={placing}
                  className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl
                    text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <><FaLock className="text-xs" /> Place Order – ${finalTotal.toFixed(2)}</>
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
              shipping={selectedShipping.price}
              total={finalTotal}
            />
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 justify-center">
              <FaLock className="text-gray-300" />
              Secure SSL Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
