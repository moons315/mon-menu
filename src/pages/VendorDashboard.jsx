import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Form, Table, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { products, orders } from '../services/api';
import { Trash } from 'react-bootstrap-icons';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/');
    }
  }, [user, navigate]);

  const [items, setItems] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Comida', image: '' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  const loadData = async () => {
    try {
      const res = await products.list();
      setItems(res.data);
      const ord = await orders.list();
      const filtered = ord.data.filter(o =>
        o.items.some(i => i.product?.vendor === user._id)
      );
      setOrderList(filtered);
    } catch {
      setError('Error cargando datos');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newProduct._id) {
        await products.update(newProduct._id, newProduct);
      } else {
        await products.create(newProduct);
      }
      setNewProduct({ name: '', price: '', category: 'Comida', image: '' });
      setError('');
      loadData();
    } catch {
      setError('Error guardando producto');
    }
  };

  const handleEdit = (product) => {
    setNewProduct({ ...product });
    setActiveTab('products');
  };

  const handleCancelEdit = () => {
    setNewProduct({ name: '', price: '', category: 'Comida', image: '' });
    setError('');
  };

  const handleDelete = async id => {
    if (window.confirm('¿Eliminar producto?')) {
      await products.remove(id);
      loadData();
    }
  };

  const markDelivered = async id => {
    await orders.markDelivered(id);
    loadData();
  };

  const cancelOrder = async id => {
    if (window.confirm('¿Anular pedido?')) {
      await orders.remove(id);
      loadData();
    }
  };

  const deleteOrder = async id => {
    if (window.confirm('¿Eliminar pedido?')) {
      await orders.remove(id);
      loadData();
    }
  };

  const traducirEstado = estado => {
    switch (estado) {
      case 'pending': return 'Pendiente';
      case 'delivered': return 'Entregado';
      default: return estado;
    }
  };

  const traducirCategoria = cat => {
    switch (cat.toLowerCase()) {
      case 'comida': return 'Comida';
      case 'bebida': return 'Bebida';
      case 'postre': return 'Postre';
      case 'otros': return 'Otros';
      default: return cat;
    }
  };

  const totalPedidosPendientes = orderList.filter(o =>
    o.status === 'pending' &&
    o.items.some(i => i.product?.vendor === user._id)
  ).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Panel del Vendedor</h2>
        <div>
          <Button
            variant={activeTab === 'products' ? 'primary' : 'light'}
            className="me-2"
            onClick={() => setActiveTab('products')}
          >
            Mis Productos
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'primary' : 'light'}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos ({totalPedidosPendientes})
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {activeTab === 'products' && (
        <>
          <h4>{newProduct._id ? 'Editar Producto' : 'Crear Producto'}</h4>
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Nombre"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="number"
                placeholder="Precio"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Select
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                required
              >
                <option value="Comida">Comida</option>
                <option value="Bebida">Bebida</option>
                <option value="Postre">Postre</option>
                <option value="Otros">Otros</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="URL de la imagen"
                value={newProduct.image}
                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant={newProduct._id ? 'warning' : 'primary'}>
                {newProduct._id ? 'Guardar cambios' : 'Crear'}
              </Button>
              {newProduct._id && (
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </Form>

          <h4>Mis Productos</h4>
          <Table striped>
            <thead>
              <tr><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{traducirCategoria(p.category)}</td>
                  <td>
                    <Button size="sm" variant="secondary" className="me-2" onClick={() => handleEdit(p)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <h4>Pedidos</h4>
          <Table striped>
            <thead>
              <tr><th>Cliente</th><th>Productos</th><th>Dirección</th><th>Teléfono</th><th>Notas</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {orderList.map(o => {
                const itemsDelVendedor = o.items.filter(i => i.product?.vendor === user._id);
                if (itemsDelVendedor.length === 0) return null;
                return (
                  <tr key={o._id}>
                    <td>{o.client?.name || 'Sin nombre'}</td>
                    <td>{itemsDelVendedor.map(i => `${i.quantity} x ${i.product.name}`).join(', ')}</td>
                    <td>{o.address}</td>
                    <td>{o.phone}</td>
                    <td>{o.notes || '-'}</td>
                    <td>{traducirEstado(o.status)}</td>
                    <td>
                      {o.status !== 'delivered' ? (
                        <>
                          <Button size="sm" className="me-2" onClick={() => cancelOrder(o._id)} variant="danger">Anular</Button>
                          <Button size="sm" onClick={() => markDelivered(o._id)}>Entregar</Button>
                        </>
                      ) : (
                        <Button variant="light" size="sm" onClick={() => deleteOrder(o._id)}>
                          <Trash />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;
