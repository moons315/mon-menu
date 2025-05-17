import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { products } from '../services/api';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    products.list()
      .then(res => setItems(res.data))
      .catch(() => setError('Error al cargar productos.'));
  }, []);

  // Agrupar productos por vendedor
  const grouped = items.reduce((acc, item) => {
    const name = item.vendor?.name || 'Sin vendedor';
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div>
      <h2>Menú</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {Object.entries(grouped).map(([vendor, prods]) => (
        <div key={vendor} className="mb-5">
          <h5>{vendor}</h5>
          <Slider {...settings}>
            {prods.map(product => (
              <div key={product._id} className="p-2">
                <ProductCard product={product} onAdd={addToCart} />
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default Menu;
