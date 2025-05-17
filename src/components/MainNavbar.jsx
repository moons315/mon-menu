import React, { useContext, useEffect, useState } from 'react';
import { Navbar as BSNavbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { orders } from '../services/api';
import { FaShoppingCart } from 'react-icons/fa';

const MainNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (user?.role === 'client') {
          const res = await orders.my();
          setPendingCount(res.data.length);
        } else if (user?.role === 'vendor') {
          const res = await orders.list();
          const myOrders = res.data.filter(o =>
            o.items.some(i => i.product?.vendor === user._id)
          );
          const uniqueOrders = [...new Map(myOrders.map(o => [o._id, o])).values()];
          setPendingCount(uniqueOrders.length);
        }
      } catch (err) {
        console.error('Error al obtener cantidad de pedidos:', err);
      }
    };

    if (user) fetchCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goHomeByRole = () => {
    if (user?.role === 'vendor') {
      navigate('/vendor');
    } else if (user?.role === 'admin') {
      navigate('/admin/users');
    } else {
      navigate('/');
    }
  };

  return (
    <BSNavbar bg="light" expand="lg">
      <Container>
        <BSNavbar.Brand style={{ cursor: 'pointer' }} onClick={goHomeByRole}>
          Mon Menu
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user?.role === 'client' && (
              <>
                <Nav.Link as={Link} to="/">Menú</Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  <FaShoppingCart style={{ marginBottom: '3px' }} /> ({cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0)})
                </Nav.Link>
              </>
            )}

            {/* Botones del vendor eliminados */}

            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/users">Usuarios</Nav.Link>
                <Nav.Link as={Link} to="/admin/products">Productos</Nav.Link>
              </>
            )}

            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              </>
            ) : (
              <NavDropdown title={<strong>{user.name}</strong>} align="end">
                {user.role === 'client' && (
                  <>
                    <NavDropdown.Item as={Link} to="/profile">Mi perfil</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orders">Mis pedidos</NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={handleLogout}>Salir</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default MainNavbar;
