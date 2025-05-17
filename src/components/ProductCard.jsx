import React, { useState, useContext } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdd = () => {
    if (quantity > 0) {
      onAdd({ ...product, qty: quantity });
    }
  };

  const isClient = user?.role === 'client';
  const isVendor = user?.role === 'vendor';

  return (
    <Card className="mb-4 h-100 d-flex flex-column">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={product.image}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>${product.price}</Card.Text>

        {isClient && (
          <>
            <Card.Text>
              <strong>Vendedor:</strong> {product.vendor?.name || 'Desconocido'}
            </Card.Text>
            <Form.Group className="mb-2">
              <Form.Label>Cantidad:</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                min={1}
                onChange={e => setQuantity(parseInt(e.target.value))}
              />
            </Form.Group>
            <div className="mt-2 d-flex justify-content-center">
              <Button onClick={handleAdd}>Agregar</Button>
            </div>
          </>
        )}

        {isVendor && (
          <div className="mt-2 d-flex justify-content-center">
            <Button variant="secondary" onClick={() => navigate('/vendor')}>
              Editar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
