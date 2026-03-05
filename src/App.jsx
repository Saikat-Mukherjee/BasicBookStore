import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './components/BookList';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Layout from './Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './pages/ProductPage';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();


function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <UserContext.Provider value={{user, setUser}}>
        <Routes>  
          <Route path="/" element={<Layout />} >
            {/* Public Routes */}
            <Route path="books" element={<BookList />} />
            <Route path='product/:id' element={<ProductPage />} />
            <Route path="help" element={<HelpSupport />} />
            
            {/* Protected/Auth Routes */}
            <Route element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="cart/:userId" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<Orders />} />
                <Route path="settings" element={<Settings />} />
                <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>
      </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;