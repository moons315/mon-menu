import React, { useEffect, useState } from 'react';
import { products } from '../services/api';
import { Alert } from 'react-bootstrap';
import ProductCardAdmin from '../components/ProductCardAdmin';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AdminProductList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const res = await products.list();
      setItems(res.data);
    } catch {
      setError('Error al cargar productos');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto permanentemente?')) {
      try {
        await products.remove(id);
        loadData();
      } catch {
        setError('No se pudo eliminar el producto');
      }
    }
  };

  // Agrupar productos por vendedor
  const groupedByVendor = items.reduce((acc, item) => {
    const vendorName = item.vendor?.name || 'Desconocido';
    if (!acc[vendorName]) acc[vendorName] = [];
    acc[vendorName].push(item);
    return acc;
  }, {});

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div>
      <h2>Productos (Admin)</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {Object.entries(groupedByVendor).map(([vendor, products]) => (
        <div key={vendor} className="mb-5">
          <h5 className="mb-3">{vendor}</h5>
          <Slider {...sliderSettings}>
            {products.map(product => (
              <div key={product._id} className="px-2">
                <ProductCardAdmin product={product} onDelete={handleDelete} />
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
