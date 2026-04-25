import { FaMapMarkerAlt, FaPhone, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { TYPE_ICON } from './constants';

export default function AddressCard({ address, onEdit, onDelete, onSetDefault, isDeleting }) {
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
