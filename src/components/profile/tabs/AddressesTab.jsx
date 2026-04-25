import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';
import AddressCard from '../AddressCard';
import AddressForm from '../AddressForm';

export default function AddressesTab({
  addresses,
  showAddForm,
  editingAddr,
  savingAddr,
  deletingId,
  onShowAddForm,
  onHideAddForm,
  onAdd,
  onUpdate,
  onDelete,
  onSetDefault,
  onEditAddr,
  onCancelEdit,
}) {
  return (
    <div>
      <SectionTitle
        icon={<FaMapMarkerAlt />}
        title="Saved Addresses"
        action={
          !showAddForm && !editingAddr && (
            <button
              onClick={onShowAddForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white
                text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Add Address
            </button>
          )
        }
      />

      {showAddForm && (
        <div className="mb-5">
          <AddressForm onSave={onAdd} onCancel={onHideAddForm} saving={savingAddr} />
        </div>
      )}

      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-16 text-gray-400">
          <FaMapMarkerAlt className="mx-auto text-4xl mb-3 opacity-30" />
          <p className="text-sm mb-4">No saved addresses yet.</p>
          <button
            onClick={onShowAddForm}
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
                  onSave={onUpdate}
                  onCancel={onCancelEdit}
                  saving={savingAddr}
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={onEditAddr}
                onDelete={onDelete}
                onSetDefault={onSetDefault}
                isDeleting={deletingId === addr.id}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
