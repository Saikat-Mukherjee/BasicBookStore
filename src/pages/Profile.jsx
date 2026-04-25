import { useEffect, useState } from 'react';
import api from '../services/api';
import ProfileHero from '../components/profile/ProfileHero';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfoTab from '../components/profile/tabs/ProfileInfoTab';
import OrdersTab from '../components/profile/tabs/OrdersTab';
import AddressesTab from '../components/profile/tabs/AddressesTab';
import ReadingListTab from '../components/profile/tabs/ReadingListTab';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getProfilePicUrl(picId) {
  if (!picId) return null;
  return `${API_BASE}/test/get/image/${picId}`;
}

const DEFAULT_USER = {
  name: '',
  email: '',
  phone: '',
  memberSince: '',
  dob: '',
  profilePicture: null,
  readingPreferences: [],
};

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  /* ── user ── */
  const [user, setUser] = useState(DEFAULT_USER);
  const [editMode, setEditMode] = useState(false);
  const [draftUser, setDraftUser] = useState(DEFAULT_USER);
  const [savingProfile, setSavingProfile] = useState(false);

  /* ── orders ── */
  const [orders, setOrders] = useState([]);

  /* ── addresses ── */
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [savingAddr,  setSavingAddr]  = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);

  /* ── reading list ── */
  const [readingList] = useState([]);

  /* ── fetch on mount ── */
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await api.get('/profile/view');
        const data = res.data;
        setUser(prev => ({
          ...prev,
          id:                 data.id                  || prev.id,
          name:               (data.firstname + ' ' + data.lastname) || prev.name,
          email:              data.email_address       || prev.email,
          phone:              data.phonenumber         || prev.phone,
          memberSince:        data.memberSince         || prev.memberSince,
          dob:                data.dob                 || prev.dob,
          profilePicId:       data.profilePicId        || prev.profilePicId,
          readingPreferences: data.readingPreferences  || prev.readingPreferences,
        }));
        setDraftUser(prev => ({
          ...prev,
          profilePicture: getProfilePicUrl(data.profilePicId) || prev.profilePicture,
        }));
      } catch { /* keep defaults */ }
    }

    async function fetchAddresses() {
      try {
        const res = await api.get('/address/all');
        if (Array.isArray(res.data)) setAddresses(res.data);
      } catch { /* keep defaults */ }
    }

    async function fetchOrders() {
      try {
        const res = await api.get('/api/orders');
        if (Array.isArray(res.data)) setOrders(res.data);
      } catch { /* keep defaults */ }
    }

    fetchUserProfile();
    fetchAddresses();
    fetchOrders();
  }, []);

  /* ── profile handlers ── */
  const handleEnterEdit     = ()       => { setDraftUser(user); setEditMode(true); };
  const handleCancelEdit    = ()       => { setDraftUser(user); setEditMode(false); };
  const handleDraftChange   = (patch)  => setDraftUser(d => ({ ...d, ...patch }));
  const handleTogglePreference = (genre) => {
    setDraftUser(d => ({
      ...d,
      readingPreferences: d.readingPreferences.includes(genre)
        ? d.readingPreferences.filter(p => p !== genre)
        : [...d.readingPreferences, genre],
    }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.post('/profile/update', {
        id:                 user.id,
        firstname:          draftUser.name.split(' ')[0],
        lastname:           draftUser.name.split(' ')[1] || '',
        email_address:      draftUser.email,
        phonenumber:        draftUser.phone,
        dob:                draftUser.dob,
        profilePicture:     draftUser.profilePicture,
        readingPreferences: draftUser.readingPreferences,
      });
    } catch { /* local update still applied */ }
    setUser(draftUser);
    setEditMode(false);
    setSavingProfile(false);
  };

  /* ── address handlers ── */
  const handleAddAddress = async (form) => {
    setSavingAddr(true);
    try {
      const res  = await api.post('/address/add', form);
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
    try { await api.put('/address/update', form); } catch { /* local update */ }
    setAddresses(prev =>
      prev.map(a => a.id === form.id ? { ...form } : form.default ? { ...a, default: false } : a)
    );
    setSavingAddr(false);
    setEditingAddr(null);
  };

  const handleDeleteAddress = async (id) => {
    setDeletingId(id);
    try { await api.delete(`/address/remove/${id}`); } catch { /* local removal */ }
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await api.put(`/address/set-default/${id}`);
      if (res.data?.default === true) {
        setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
      }
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <ProfileHero
          user={user}
          ordersCount={orders.length}
          addressesCount={addresses.length}
          readingCount={readingList.length}
          getProfilePicUrl={getProfilePicUrl}
        />

        <div className="flex flex-col md:flex-row gap-5">
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              {activeTab === 'profile' && (
                <ProfileInfoTab
                  user={user}
                  draftUser={draftUser}
                  editMode={editMode}
                  savingProfile={savingProfile}
                  onEnterEdit={handleEnterEdit}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                  onDraftChange={handleDraftChange}
                  onTogglePreference={handleTogglePreference}
                  getProfilePicUrl={getProfilePicUrl}
                />
              )}

              {activeTab === 'orders' && <OrdersTab orders={orders} />}

              {activeTab === 'addresses' && (
                <AddressesTab
                  addresses={addresses}
                  showAddForm={showAddForm}
                  editingAddr={editingAddr}
                  savingAddr={savingAddr}
                  deletingId={deletingId}
                  onShowAddForm={() => setShowAddForm(true)}
                  onHideAddForm={() => setShowAddForm(false)}
                  onAdd={handleAddAddress}
                  onUpdate={handleUpdateAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefault}
                  onEditAddr={setEditingAddr}
                  onCancelEdit={() => setEditingAddr(null)}
                />
              )}

              {activeTab === 'reading' && <ReadingListTab readingList={readingList} />}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
