import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import ProfileHero from '../components/profile/ProfileHero';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileInfoTab from '../components/profile/tabs/ProfileInfoTab';
import OrdersTab from '../components/profile/tabs/OrdersTab';
import AddressesTab from '../components/profile/tabs/AddressesTab';
import ReadingListTab from '../components/profile/tabs/ReadingListTab';

const DEFAULT_USER = {
  name: '',
  email: '',
  phone: '',
  memberSince: '',
  dob: '',
  dateOfBirth: '',
  profilePicId: null,
  profilePicture: null,
  imageFile: null,
  readingPreferences: [],
};

function extractPresignedUrl(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') return payload;
  return payload.url || payload.presignedUrl || payload.imageUrl || payload.signedUrl || null;
}

function extractGenres(data) {
  const rawPreferences = Array.isArray(data?.preferences)
    ? data.preferences
    : Array.isArray(data?.readingPreferences)
      ? data.readingPreferences
      : [];

  return rawPreferences
    .map((item) => {
      if (typeof item === 'string') return item;
      return item?.name || item?.genre || null;
    })
    .filter(Boolean);
}

function extractGenreOptions(data) {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => item?.name)
    .filter(Boolean);
}

function buildGenreIdMap(data) {
  if (!Array.isArray(data)) return {};
  return data.reduce((acc, item) => {
    const id = item?.id;
    const name = item?.name;
    if (id && name) acc[name] = id;
    return acc;
  }, {});
}

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  /* ── user ── */
  const [user, setUser] = useState(DEFAULT_USER);
  const [editMode, setEditMode] = useState(false);
  const [draftUser, setDraftUser] = useState(DEFAULT_USER);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [genreOptions, setGenreOptions] = useState([]);
  const [genreIdMap, setGenreIdMap] = useState({});

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

  const getProfilePicUrl = (profilePictureKey) => {
    if (!profilePictureKey) return null;
    return profileImageUrl;
  };

  const fetchProfileImageUrl = useCallback(async (profilePictureKey) => {
    if (!profilePictureKey) {
      setProfileImageUrl(null);
      return null;
    }

    try {
      const res = await api.get('/profile/image', {
        params: { profilePictureKey },
      });
      const presignedUrl = extractPresignedUrl(res.data);
      setProfileImageUrl(presignedUrl);
      return presignedUrl;
    } catch {
      setProfileImageUrl(null);
      return null;
    }
  }, []);

  /* ── fetch on mount ── */
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await api.get('/profile/view');
        const data = res.data;
        const genres = extractGenres(data);
        const memberSince = data.memberSince || data.createdAt?.split('T')[0] || '';
        const profilePictureKey = data.profilePictureKey || data.profilePicId || null;
        const presignedUrl = await fetchProfileImageUrl(profilePictureKey);
        setUser(prev => ({
          ...prev,
          id:                 data.id                  || prev.id,
          name:               [data.firstname, data.lastname].filter(Boolean).join(' ') || prev.name,
          email:              data.email_address       || prev.email,
          phone:              data.phonenumber         || prev.phone,
          memberSince:        memberSince              || prev.memberSince,
          dob:                data.dateOfBirth?.split('T')[0] || data.dob || prev.dob,
          dateOfBirth:        data.dateOfBirth?.split('T')[0] || data.dob || prev.dateOfBirth,
          profilePicId:       profilePictureKey        || prev.profilePicId,
          profilePictureKey:  profilePictureKey        || prev.profilePictureKey,
          readingPreferences: genres.length ? genres : prev.readingPreferences,
        }));
        setDraftUser(prev => ({
          ...prev,
          name: [data.firstname, data.lastname].filter(Boolean).join(' ') || prev.name,
          email: data.email_address || prev.email,
          phone: data.phonenumber || prev.phone,
          dob: data.dateOfBirth?.split('T')[0] || data.dob || prev.dob,
          dateOfBirth: data.dateOfBirth?.split('T')[0] || data.dob || prev.dateOfBirth,
          profilePicId: profilePictureKey || prev.profilePicId,
          profilePictureKey: profilePictureKey || prev.profilePictureKey,
          profilePicture: presignedUrl,
          imageFile: null,
          readingPreferences: genres.length ? genres : prev.readingPreferences,
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

    async function fetchGenreOptions() {
      try {
        const res = await api.get('/genres/all');
        const names = extractGenreOptions(res.data);
        const idMap = buildGenreIdMap(res.data);
        setGenreOptions(names);
        setGenreIdMap(idMap);
      } catch {
        setGenreOptions([]);
        setGenreIdMap({});
      }
    }

    fetchUserProfile();
    fetchAddresses();
    fetchOrders();
    fetchGenreOptions();
  }, [fetchProfileImageUrl]);

  /* ── profile handlers ── */
  const handleEnterEdit     = ()       => { setDraftUser({ ...user, imageFile: null }); setEditMode(true); };
  const handleCancelEdit    = ()       => { setDraftUser({ ...user, imageFile: null }); setEditMode(false); };
  const handleDraftChange   = (patch)  => setDraftUser(d => ({ ...d, ...patch }));
  const handleTogglePreference = (genre) => {
    setDraftUser(d => ({
      ...d,
      readingPreferences: (d.readingPreferences || []).includes(genre)
        ? (d.readingPreferences || []).filter(p => p !== genre)
        : [...(d.readingPreferences || []), genre],
    }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const nameParts = (draftUser.name || '').trim().split(/\s+/).filter(Boolean);
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ');
    const dateOfBirth = draftUser.dob || draftUser.dateOfBirth || '';
    const requestBody = {
      firstname,
      lastname,
      phonenumber: draftUser.phone || '',
      email_address: draftUser.email || '',
      dateOfBirth,
    };

    try {
      const formData = new FormData();
      formData.set('firstname', requestBody.firstname);
      formData.set('lastname', requestBody.lastname);
      formData.set('phonenumber', requestBody.phonenumber);
      formData.set('email_address', requestBody.email_address);
      formData.set('dateOfBirth', requestBody.dateOfBirth);
      (draftUser.readingPreferences || []).forEach((genreName) => {
        const genreId = genreIdMap[genreName] || null;
        if (genreId) {
          formData.append('genreIds', genreId);
        }
      });

      if (draftUser.imageFile) {
        formData.set('image_resource', draftUser.imageFile);
      }

      console.log(
        'profile/update-info FormData entries',
        Array.from(formData.entries()).map(([k, v]) => [k, v instanceof File ? `${v.name} (${v.size} bytes)` : v])
      );

      const res = await api.post('/profile/update-info', formData);
      const updated = res.data;
      const nextProfilePictureKey = updated?.profilePictureKey || updated?.profilePicId || user.profilePictureKey || user.profilePicId;
      const nextProfileImageUrl = await fetchProfileImageUrl(nextProfilePictureKey);

      setUser(prev => ({
        ...prev,
        name: [updated?.firstname ?? firstname, updated?.lastname ?? lastname].filter(Boolean).join(' ').trim(),
        email: updated?.email_address ?? (draftUser.email || prev.email),
        phone: updated?.phonenumber ?? (draftUser.phone || prev.phone),
        dob: updated?.dateOfBirth?.split('T')[0] || draftUser.dob || draftUser.dateOfBirth || prev.dob,
        dateOfBirth: updated?.dateOfBirth?.split('T')[0] || draftUser.dob || draftUser.dateOfBirth || prev.dateOfBirth,
        profilePicId: nextProfilePictureKey ?? prev.profilePicId,
        profilePictureKey: nextProfilePictureKey ?? prev.profilePictureKey,
      }));
      setDraftUser(prev => ({
        ...prev,
        profilePicId: nextProfilePictureKey || prev.profilePicId,
        profilePictureKey: nextProfilePictureKey || prev.profilePictureKey,
        profilePicture: nextProfileImageUrl,
        imageFile: null,
      }));
      setEditMode(false);
      setSavingProfile(false);
      return;
    } catch (err) {
      console.error('Profile update failed:', err?.response?.status, err?.response?.data || err?.message);
    }

    setUser(prev => ({
      ...prev,
      name: draftUser.name,
      email: draftUser.email,
      phone: draftUser.phone,
      dob: draftUser.dob || draftUser.dateOfBirth,
      dateOfBirth: draftUser.dob || draftUser.dateOfBirth,
    }));
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
                  genreOptions={genreOptions}
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
