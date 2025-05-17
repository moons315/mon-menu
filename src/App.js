import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import MainNavbar from './components/MainNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import VendorDashboard from './pages/VendorDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProductList from './pages/AdminProductList';
import MyOrders from './pages/MyOrders'; // ✅ nuevo import

const App = () => {
  return (
    <>
      <MainNavbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute roles={["client"]}>
                <Menu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["client"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["client"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProductList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
