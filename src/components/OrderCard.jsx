import React from 'react';
import { Card, Button } from 'react-bootstrap';

const OrderCard = ({ order, onDeliver }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Pedido de {order.user?.name}</Card.Title>
        <Card.Text>
          <strong>Dirección:</strong> {order.address}<br />
          <strong>Teléfono:</strong> {order.phone}<br />
          <strong>Estado:</strong> {order.status}<br />
          <strong>Productos:</strong>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.quantity} x {item.product.name}</li>
            ))}
          </ul>
        </Card.Text>
        {order.status !== 'delivered' && (
          <Button onClick={() => onDeliver(order._id)}>Marcar como entregado</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderCard;