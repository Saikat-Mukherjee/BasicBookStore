import { useEffect, useState } from 'react';
import {
  FaBook, FaBookOpen, FaMapMarkerAlt, FaBox, FaUser,
  FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaStar,
  FaPhone, FaEnvelope, FaCalendarAlt, FaHome, FaBriefcase,
} from 'react-icons/fa';
import api from '../services/api';

/* ─── helpers ─── */
const STATUS_STYLES = {
  Delivered:  'bg-green-50 text-green-700 border border-green-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-amber-50 text-amber-700 border border-amber-200',
  Cancelled:  'bg-red-50 text-red-700 border border-red-200',
};

const EMPTY_ADDRESS = {
  type: 'HOME',
  //name: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  zipCode: '',
  default: false,
};

const TYPE_ICON = {
  HOME:   <FaHome />,
  OFFICE: <FaBriefcase />,
  OTHER:  <FaMapMarkerAlt />,
};

/* ─── TabButton ─── */
function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
        ${active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
        }`}
    >
      <span className={`text-base ${active ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
      {label}
    </button>
  );
}

/* ─── SectionTitle ─── */
function SectionTitle({ icon, title, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        {title}
      </h3>
      {action}
    </div>
  );
}

/* ─── InputField ─── */
function InputField({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
      />
    </div>
  );
}

/* ─── AddressForm ─── */
function AddressForm({ initial = EMPTY_ADDRESS, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial });
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving address:', form);
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
      <p className="text-sm font-semibold text-blue-700">
        {initial.id ? 'Edit Address' : 'Add New Address'}
      </p>

      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {['HOME', 'OFFICE', 'OTHER'].map(t => (
          <button
            type="button"
            key={t}
            onClick={() => set('type', t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all
              ${form.type === t
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
          >
            {TYPE_ICON[t] ?? <FaMapMarkerAlt />} {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Full Name" value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Jane Doe" required
        />
        <InputField
          label="Phone" type="tel" value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+1 555 000 0000"
        />
        <div className="sm:col-span-2">
          <InputField
            label="Address Line 1" value={form.addressLine1}
            onChange={e => set('addressLine1', e.target.value)}
            placeholder="Street address, P.O. box" required
          />
        </div>
        <div className="sm:col-span-2">
          <InputField
            label="Address Line 2 (optional)" value={form.addressLine2}
            onChange={e => set('addressLine2', e.target.value)}
            placeholder="Apt, suite, unit, building"
          />
        </div>
        <InputField
          label="City" value={form.city}
          onChange={e => set('city', e.target.value)}
          placeholder="Boston" required
        />
        <InputField
          label="State" value={form.state}
          onChange={e => set('state', e.target.value)}
          placeholder="MA" required
        />
        <InputField
          label="ZIP / Postal Code" value={form.zipCode}
          onChange={e => set('zipCode', e.target.value)}
          placeholder="02108" required
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.default}
          onChange={e => set('default', e.target.checked)}
          className="w-4 h-4 accent-blue-600 rounded"
        />
        <span className="text-sm text-gray-600">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium
            rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving
            ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            : <FaCheck />
          }
          {initial.id ? 'Update Address' : 'Save Address'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2 bg-white text-gray-600 text-sm font-medium
            rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}

/* ─── AddressCard ─── */
function AddressCard({ address, onEdit, onDelete, onSetDefault, isDeleting }) {
  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-all
        ${address.default
          ? 'border-blue-300 bg-blue-50/40'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
    >
      {address.default && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold
          text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          <FaStar className="text-xs" /> Default
        </span>
      )}

      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-blue-500">{TYPE_ICON[address.type] ?? <FaMapMarkerAlt />}</span>
        {address.type}
      </div>

      <div className="text-sm text-gray-700 leading-relaxed space-y-0.5">
        {address.name && <p className="font-medium">{address.name}</p>}
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.zipCode}</p>
        {address.phone && (
          <p className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <FaPhone className="text-xs" /> {address.phone}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {!address.default && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600
              hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            Set as default
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600
            hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
          className="text-xs px-3 py-1 rounded-lg border border-red-100 text-red-400
            hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          <FaTrash /> {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PROFILE PAGE
════════════════════════════════════════════ */
function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  /* ── user ── */
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    memberSince: '2023',
    readingPreferences: ['Fiction', 'Science', 'History'],
  });
  const [editMode, setEditMode]     = useState(false);
  const [draftUser, setDraftUser]   = useState(user);
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── orders ── */
  const [orders] = useState([
    {
      id: 1,
      books: [
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 15.99 },
        { title: '1984',             author: 'George Orwell',        price: 12.99 },
      ],
      date: '2024-03-15', status: 'Delivered', total: 28.98,
    },
    {
      id: 2,
      books: [{ title: 'Dune', author: 'Frank Herbert', price: 19.99 }],
      date: '2024-03-10', status: 'Shipped', total: 19.99,
    },
  ]);

  /* ── addresses ── */
  const [addresses, setAddresses]     = useState([
    { id: 1, type: 'Home',   fullName: 'John Doe', phone: '123-456-7890', addressLine1: '123 Main St',  addressLine2: '', city: 'Boston', state: 'MA', zip: '02108', default: true  },
    { id: 2, type: 'Office', fullName: 'John Doe', phone: '123-456-7890', addressLine1: '456 Work Ave', addressLine2: '', city: 'Boston', state: 'MA', zip: '02109', default: false },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [savingAddr,  setSavingAddr]  = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);

  /* ── reading list ── */
  const [readingList] = useState([
    { id: 1, title: 'Project Hail Mary', author: 'Andy Weir',   progress: 75 },
    { id: 2, title: 'Atomic Habits',     author: 'James Clear', progress: 30 },
  ]);

  /* ── fetch on mount ── */
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await api.get('/users/profile');
        setUser(prev => ({
          ...prev,
          name:  res.data.username || prev.name,
          email: res.data.email    || prev.email,
          phone: res.data.phone    || prev.phone,
          memberSince: res.data.memberSince || prev.memberSince,
          readingPreferences: res.data.readingPreferences || prev.readingPreferences,
        }));
      } catch { /* keep defaults */ }
    }
    async function fetchAddresses() {
      try {
        const res = await api.get('/address/all');
        if (Array.isArray(res.data) && res.data.length > 0) setAddresses(res.data);
      } catch { /* keep defaults */ }
    }
    fetchUserProfile();
    fetchAddresses();
  }, []);

  /* ── profile handlers ── */
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try { await api.put('/users/profile', draftUser); } catch { /* local update */ }
    setUser(draftUser);
    setEditMode(false);
    setSavingProfile(false);
  };

  /* ── address handlers ── */
  const handleAddAddress = async (form) => {
    setSavingAddr(true);
    try {
      //const res = await api.post('/address', form);
      const res = await api.post('/address/add', form);
      const saved = res.data?.id ? res.data : { ...form, id: Date.now() };
      setAddresses(prev =>
        form.default
          ? prev.map(a => ({ ...a, default: false })).concat({ ...saved, default: true })
          : [...prev, saved]
      );
    } catch {
      setAddresses(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setSavingAddr(false);
    setShowAddForm(false);
  };

  const handleUpdateAddress = async (form) => {
    setSavingAddr(true);
    try { await api.put(`/address/${form.id}`, form); } catch { /* local update */ }
    setAddresses(prev =>
      prev.map(a =>
        a.id === form.id
          ? { ...form }
          : form.default ? { ...a, default: false } : a
      )
    );
    setSavingAddr(false);
    setEditingAddr(null);
  };

  const handleDeleteAddress = async (id) => {
    setDeletingId(id);
    try { await api.delete(`/address/${id}`); } catch { /* local removal */ }
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const handleSetDefault = async (id) => {
    try { await api.put(`/address/${id}/default`); } catch { /* local update */ }
    setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
  };

  /* ── derived ── */
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  /* ════════════════════════════
     RENDER
  ════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Profile hero banner ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5
          flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar initials */}
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center
            text-white text-2xl font-bold shadow-md shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <FaEnvelope className="text-blue-400 shrink-0" /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FaPhone className="text-blue-400 shrink-0" /> {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <FaCalendarAlt className="text-blue-400 shrink-0" /> Member since {user.memberSince}
              </span>
            </div>
            {user.readingPreferences?.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                {user.readingPreferences.map(p => (
                  <span key={p} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full
                    text-xs font-medium border border-blue-100">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            {[
              { value: orders.length,      label: 'Orders'    },
              { value: addresses.length,   label: 'Addresses' },
              { value: readingList.length, label: 'Reading'   },
            ].map(({ value, label }) => (
              <div key={label} className="text-center bg-gray-50 rounded-xl px-4 py-2">
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col md:flex-row gap-5">

          {/* ── Sidebar nav ── */}
          <nav className="md:w-48 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3
              flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              <TabButton icon={<FaUser />}        label="Profile"      active={activeTab === 'profile'}   onClick={() => setActiveTab('profile')} />
              <TabButton icon={<FaBox />}          label="Orders"       active={activeTab === 'orders'}    onClick={() => setActiveTab('orders')} />
              <TabButton icon={<FaMapMarkerAlt />} label="Addresses"    active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
              <TabButton icon={<FaBookOpen />}     label="Reading List" active={activeTab === 'reading'}   onClick={() => setActiveTab('reading')} />
            </div>
          </nav>

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              {/* ════ PROFILE TAB ════ */}
              {activeTab === 'profile' && (
                <div>
                  <SectionTitle
                    icon={<FaUser />}
                    title="Personal Information"
                    action={
                      !editMode && (
                        <button
                          onClick={() => { setDraftUser(user); setEditMode(true); }}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaEdit /> Edit
                        </button>
                      )
                    }
                  />

                  {!editMode ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name',    value: user.name          },
                        { label: 'Email',        value: user.email         },
                        { label: 'Phone',        value: user.phone || '—'  },
                        { label: 'Member Since', value: user.memberSince   },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-4">
                          <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                            {label}
                          </dt>
                          <dd className="text-sm font-medium text-gray-800">{value}</dd>
                        </div>
                      ))}
                      <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                          Reading Preferences
                        </dt>
                        <dd className="flex flex-wrap gap-2">
                          {user.readingPreferences?.map(p => (
                            <span key={p} className="px-3 py-1 bg-white border border-blue-100
                              text-blue-600 rounded-full text-sm font-medium">
                              {p}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="Full Name" value={draftUser.name} required
                          onChange={e => setDraftUser(d => ({ ...d, name: e.target.value }))}
                          placeholder="Your name"
                        />
                        <InputField
                          label="Email" type="email" value={draftUser.email} required
                          onChange={e => setDraftUser(d => ({ ...d, email: e.target.value }))}
                          placeholder="your@email.com"
                        />
                        <InputField
                          label="Phone" type="tel" value={draftUser.phone}
                          onChange={e => setDraftUser(d => ({ ...d, phone: e.target.value }))}
                          placeholder="+1 555 000 0000"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white
                            text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                          {savingProfile
                            ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                              </svg>
                            : <FaCheck />
                          }
                          Save Changes
                        </button>
                        <button
                          onClick={() => { setDraftUser(user); setEditMode(false); }}
                          className="flex items-center gap-2 px-5 py-2 bg-white text-gray-600
                            text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ════ ORDERS TAB ════ */}
              {activeTab === 'orders' && (
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
              )}

              {/* ════ ADDRESSES TAB ════ */}
              {activeTab === 'addresses' && (
                <div>
                  <SectionTitle
                    icon={<FaMapMarkerAlt />}
                    title="Saved Addresses"
                    action={
                      !showAddForm && !editingAddr && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white
                            text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaPlus /> Add Address
                        </button>
                      )
                    }
                  />

                  {/* Add form */}
                  {showAddForm && (
                    <div className="mb-5">
                      <AddressForm
                        onSave={handleAddAddress}
                        onCancel={() => setShowAddForm(false)}
                        saving={savingAddr}
                      />
                    </div>
                  )}

                  {/* Empty state */}
                  {addresses.length === 0 && !showAddForm ? (
                    <div className="text-center py-16 text-gray-400">
                      <FaMapMarkerAlt className="mx-auto text-4xl mb-3 opacity-30" />
                      <p className="text-sm mb-4">No saved addresses yet.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600
                          text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaPlus /> Add your first address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map(addr =>
                        editingAddr?.id === addr.id ? (
                          <div key={addr.id} className="sm:col-span-2">
                            <AddressForm
                              initial={editingAddr}
                              onSave={handleUpdateAddress}
                              onCancel={() => setEditingAddr(null)}
                              saving={savingAddr}
                            />
                          </div>
                        ) : (
                          <AddressCard
                            key={addr.id}
                            address={addr}
                            onEdit={setEditingAddr}
                            onDelete={handleDeleteAddress}
                            onSetDefault={handleSetDefault}
                            isDeleting={deletingId === addr.id}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ════ READING LIST TAB ════ */}
              {activeTab === 'reading' && (
                <div>
                  <SectionTitle icon={<FaBookOpen />} title="Reading List" />
                  {readingList.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <FaBook className="mx-auto text-4xl mb-3 opacity-30" />
                      <p className="text-sm">Your reading list is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {readingList.map(book => (
                        <div key={book.id} className="flex items-center gap-4 bg-gray-50 rounded-xl
                          p-4 hover:bg-gray-100/70 transition-colors">
                          <div className="w-10 h-14 bg-blue-100 rounded-lg flex items-center
                            justify-center shrink-0">
                            <FaBook className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm truncate">{book.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                  style={{ width: `${book.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-blue-600 w-8 text-right">
                                {book.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;