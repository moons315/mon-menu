import React, { useEffect, useState } from 'react';
import { orders } from '../services/api';

const MyOrders = () => {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orders.my();
        setOrderList(res.data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
      }
    };
    fetchOrders();
  }, []);

  if (orderList.length === 0) return <p className="text-center">No tenés pedidos aún.</p>;

  return (
    <div className="container mt-4">
      <h2>Mis pedidos ({orderList.length})</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map(order => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <ul className="mb-0">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name} ×{item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status === 'pending' ? 'pendiente' : order.status === 'delivered' ? 'entregado' : order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
