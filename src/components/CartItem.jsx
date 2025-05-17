import React from 'react';
import { Button } from 'react-bootstrap';

const CartItem = ({ item, onRemove, onQtyChange }) => {
  return (
    <tr>
      <td>{item.name}</td>
      <td>
        <Button variant="light" onClick={() => onQtyChange(item._id, item.qty - 1)}>-</Button>
        {' '}{item.qty}{' '}
        <Button variant="light" onClick={() => onQtyChange(item._id, item.qty + 1)}>+</Button>
      </td>
      <td>${(item.price * item.qty).toFixed(2)}</td>
      <td>
        <Button variant="danger" onClick={() => onRemove(item._id)}>Eliminar</Button>
      </td>
    </tr>
  );
};

export default CartItem;
