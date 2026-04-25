import { useState } from 'react';
import { FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { EMPTY_ADDRESS, TYPE_ICON } from './constants';
import InputField from './InputField';

export default function AddressForm({ initial = EMPTY_ADDRESS, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial });
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-4">
      <p className="text-sm font-semibold text-blue-700">
        {initial.id ? 'Edit Address' : 'Add New Address'}
      </p>

      <div className="flex gap-2 flex-wrap">
        {['HOME', 'WORK', 'OTHER'].map(t => (
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
          label="Full Name" value={form.name ?? ''}
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
