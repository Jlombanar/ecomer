import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import VerifyCode from './components/Auth/VerifyCode';
import AdminPanel from './components/Auth/Admin';
import Home from './components/Pages/Home';
import Productos from './components/Pages/Productos.jsx';
import Checkout from './components/Pages/Checkout.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-code" element={<VerifyCode />} />

            <Route path="/productos" element={<Productos />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute rolRequerido="admin">
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;