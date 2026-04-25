import { FaHome, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

export const STATUS_STYLES = {
  Delivered:  'bg-green-50 text-green-700 border border-green-200',
  Shipped:    'bg-blue-50 text-blue-700 border border-blue-200',
  Processing: 'bg-amber-50 text-amber-700 border border-amber-200',
  Cancelled:  'bg-red-50 text-red-700 border border-red-200',
};

export const EMPTY_ADDRESS = {
  type: 'HOME',
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

export const TYPE_ICON = {
  HOME:  <FaHome />,
  WORK:  <FaBriefcase />,
  OTHER: <FaMapMarkerAlt />,
};

export const GENRES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Self-Help',
  'Science', 'Technology', 'Business', 'History', 'Horror', 'Poetry',
  'Graphic Novel', 'Young Adult', "Children's",
];
