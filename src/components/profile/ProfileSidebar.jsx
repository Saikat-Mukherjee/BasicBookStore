import { FaUser, FaBox, FaMapMarkerAlt, FaBookOpen } from 'react-icons/fa';
import TabButton from './TabButton';

const TABS = [
  { id: 'profile',   icon: <FaUser />,        label: 'Profile'      },
  { id: 'orders',    icon: <FaBox />,          label: 'Orders'       },
  { id: 'addresses', icon: <FaMapMarkerAlt />, label: 'Addresses'    },
  { id: 'reading',   icon: <FaBookOpen />,     label: 'Reading List' },
];

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <nav className="md:w-48 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3
        flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {TABS.map(tab => (
          <TabButton
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}
