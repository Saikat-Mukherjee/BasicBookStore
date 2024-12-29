import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './components/BookList';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Layout from './layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          {/* <ProtectedRoute index element={<Home />} /> */}
            <Route element={<ProtectedRoute />}>
              <Route path="signup" element={<Signup />} />
              <Route path='login' element={<Login />} />
              <Route index element={<Home />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="books" element={<BookList />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<Cart />} />
          </Route>
        </Route>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;