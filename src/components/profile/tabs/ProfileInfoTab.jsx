import { useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaEdit, FaCheck, FaTimes, FaCamera, FaTag } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';
import InputField from '../InputField';

export default function ProfileInfoTab({
  user,
  draftUser,
  genreOptions,
  editMode,
  savingProfile,
  onEnterEdit,
  onSave,
  onCancel,
  onDraftChange,
  onTogglePreference,
  getProfilePicUrl,
}) {
  const picInputRef = useRef(null);
  const resolvedProfilePic = getProfilePicUrl(user.profilePictureKey || user.profilePicId);
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  return (
    <div>
      <SectionTitle
        icon={<FaUser />}
        title="Personal Information"
        action={
          !editMode && (
            <button
              onClick={onEnterEdit}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <FaEdit /> Edit
            </button>
          )
        }
      />

      {!editMode ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resolvedProfilePic && (
            <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2 flex items-center gap-4">
              <img
                src={resolvedProfilePic}
                alt={user.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-blue-100"
              />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Profile Photo</dt>
                <dd className="text-xs text-gray-500">Click Edit to change your photo</dd>
              </div>
            </div>
          )}
          {[
            { label: 'Full Name',     value: user.name         },
            { label: 'Email',         value: user.email        },
            { label: 'Phone',         value: user.phone || '—' },
            { label: 'Member Since',  value: user.memberSince  },
            { label: 'Date of Birth', value: user.dob
                ? new Date(user.dob + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</dt>
              <dd className="text-sm font-medium text-gray-800">{value}</dd>
            </div>
          ))}
          <div className="bg-gray-50 rounded-xl p-4 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Reading Preferences</dt>
            <dd className="flex flex-wrap gap-2">
              {user.readingPreferences?.length > 0
                ? user.readingPreferences.map(p => (
                    <span key={p} className="px-3 py-1 bg-white border border-blue-100
                      text-blue-600 rounded-full text-sm font-medium">
                      {p}
                    </span>
                  ))
                : <span className="text-sm text-gray-400">No preferences set</span>
              }
            </dd>
          </div>
        </dl>
      ) : (
        <div className="space-y-5">
          {/* Profile Picture Upload */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div
              className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer group shadow-sm"
              onClick={() => picInputRef.current?.click()}
            >
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                {draftUser.profilePicture
                  ? <img src={draftUser.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  : initials
                }
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white text-base" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF · Max 5 MB</p>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => picInputRef.current?.click()}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  {draftUser.profilePicture ? 'Change photo' : 'Upload photo'}
                </button>
                {draftUser.profilePicture && (
                  <button
                    type="button"
                    onClick={() => onDraftChange({ profilePicture: null, imageFile: null })}
                    className="text-xs font-medium text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={picInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => onDraftChange({ profilePicture: ev.target.result, imageFile: file });
                reader.readAsDataURL(file);
              }}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name" value={draftUser.name} required
              onChange={e => onDraftChange({ name: e.target.value })}
              placeholder="Your name"
            />
            <InputField
              label="Email" type="email" value={draftUser.email} required
              onChange={e => onDraftChange({ email: e.target.value })}
              placeholder="your@email.com"
            />
            <InputField
              label="Phone" type="tel" value={draftUser.phone}
              onChange={e => onDraftChange({ phone: e.target.value })}
              placeholder="+1 555 000 0000"
            />
            <InputField
              label="Date of Birth" type="date" value={draftUser.dob || ''}
              onChange={e => onDraftChange({ dob: e.target.value })}
            />
          </div>

          {/* Reading Preferences */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              <FaTag className="text-blue-400" /> Reading Preferences
              <span className="normal-case font-normal text-gray-400 ml-1">— select all that apply</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(genreOptions || []).map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => onTogglePreference(genre)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                    ${(draftUser.readingPreferences || []).includes(genre)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            {(draftUser.readingPreferences || []).length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {(draftUser.readingPreferences || []).length} genre{(draftUser.readingPreferences || []).length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onSave}
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
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2 bg-white text-gray-600
                text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileInfoTab.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    memberSince: PropTypes.string,
    dob: PropTypes.string,
    profilePictureKey: PropTypes.string,
    profilePicId: PropTypes.string,
    readingPreferences: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  draftUser: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    profilePicture: PropTypes.string,
    readingPreferences: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  genreOptions: PropTypes.arrayOf(PropTypes.string),
  editMode: PropTypes.bool.isRequired,
  savingProfile: PropTypes.bool.isRequired,
  onEnterEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDraftChange: PropTypes.func.isRequired,
  onTogglePreference: PropTypes.func.isRequired,
  getProfilePicUrl: PropTypes.func.isRequired,
};

ProfileInfoTab.defaultProps = {
  genreOptions: [],
};
