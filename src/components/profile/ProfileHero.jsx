import { FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

export default function ProfileHero({ user, ordersCount, addressesCount, readingCount, getProfilePicUrl }) {
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5
      flex flex-col sm:flex-row items-center sm:items-start gap-5">

      {/* Avatar */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md
        flex items-center justify-center text-white text-2xl font-bold bg-blue-600">
        {getProfilePicUrl(user.profilePicId)
          ? <img src={getProfilePicUrl(user.profilePicId)} alt={user.name} className="w-full h-full object-cover" />
          : initials
        }
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
          { value: ordersCount,    label: 'Orders'    },
          { value: addressesCount, label: 'Addresses' },
          { value: readingCount,   label: 'Reading'   },
        ].map(({ value, label }) => (
          <div key={label} className="text-center bg-gray-50 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
