import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ProductCardAdmin = ({ product, onDelete }) => {
  return (
    <Card className="mb-3">
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
        <Card.Text>
          <strong>Vendedor:</strong> {product.vendor?.name || 'Desconocido'}
        </Card.Text>
        <Button variant="danger" size="sm" onClick={() => onDelete(product._id)}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCardAdmin;
