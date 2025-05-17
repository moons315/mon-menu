import React, { useContext, useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, checkout, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState('card');
  const [delivery, setDelivery] = useState('delivery');
  const [error, setError] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [vendedoresConfirmados, setVendedoresConfirmados] = useState([]);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!address || !phone) {
      setError('Por favor completa dirección y teléfono.');
      return;
    }

    const pedidosPorVendedor = {};
    for (const item of cart) {
      const vendorId = item.product?.vendor || item.vendor;
      if (!pedidosPorVendedor[vendorId]) {
        pedidosPorVendedor[vendorId] = [];
      }
      pedidosPorVendedor[vendorId].push(item);
    }

    try {
      const promises = Object.entries(pedidosPorVendedor).map(([vendorId, items]) => {
        const pedido = {
          address,
          phone,
          notes,
          payment,
          delivery,
          items: items.map(i => ({
            product: i.product?._id || i._id,
            qty: i.qty,
          })),
        };
        return checkout(pedido);
      });

      await Promise.all(promises);

      const vendedores = [...new Set(cart.map(i => i.product?.vendor?.name || i.vendor?.name || 'el vendedor'))];

      clearCart();
      setPedidoConfirmado(true);
      setVendedoresConfirmados(vendedores);
      setConfirmMessage(`🎉 Tu pedido fue enviado. ${vendedores.join(', ')} ya recibió tu pedido.`);
    } catch (err) {
      console.error(err);
      setError('Error al confirmar el/los pedidos.');
    }
  };

  // Mostrar mensaje de éxito aunque el carrito esté vacío
  if (pedidoConfirmado) {
    return (
      <div>
        <h2>Carrito</h2>
        <Alert variant="success">{confirmMessage || '🎉 Se enviaron los pedidos correspondientes a cada vendedor.'}</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Ir al menú</Button>
      </div>
    );
  } else if (cart.length === 0) {
    return (
      <div>
        <h2>Carrito</h2>
        <Alert variant="info">Todavía no tienes ningún pedido.</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Ir al menú</Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Carrito</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={removeFromCart}
              onQtyChange={updateQuantity}
            />
          ))}
        </tbody>
      </Table>
      <h4>Total: ${total.toFixed(2)}</h4>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control value={address} onChange={e => setAddress(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control value={phone} onChange={e => setPhone(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notas</Form.Label>
          <Form.Control as="textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Forma de pago</Form.Label>
          <Form.Select value={payment} onChange={e => setPayment(e.target.value)}>
            <option value="card">Mi tarjeta guardada</option>
            <option value="cash">Efectivo al delivery</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Forma de entrega</Form.Label>
          <Form.Select value={delivery} onChange={e => setDelivery(e.target.value)}>
            <option value="delivery">Envío a domicilio</option>
            <option value="pickup">Retiro en el local</option>
          </Form.Select>
        </Form.Group>
        <Button onClick={handleCheckout}>Confirmar Pedido</Button>
      </Form>
    </div>
  );
};

export default Cart;
