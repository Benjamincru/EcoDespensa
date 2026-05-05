import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, Carrot, Milk, Wheat, Coffee, Leaf, Archive } from 'lucide-react';

const categoriasPredeterminadas = [
  { id: 1, nombre: 'Verduras', icon: <Carrot size={40} color="#e67e22"/> },
  { id: 2, nombre: 'Frutas', icon: <Apple size={40} color="#e74c3c"/> },
  { id: 3, nombre: 'Lácteos', icon: <Milk size={40} color="#3498db"/> },
  { id: 4, nombre: 'Cereales', icon: <Wheat size={40} color="#f1c40f"/> },
  { id: 5, nombre: 'Infusiones', icon: <Coffee size={40} color="#8e44ad"/> },
  { id: 6, nombre: 'Cuidado Natural', icon: <Leaf size={40} color="#2ECC71"/> },
  { id: 7, nombre: 'Conservas', icon: <Archive size={40} color="#95a5a6"/> },
];

const Categorias = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 style={{ marginBottom: '25px' }}>Categorías de tu Despensa</h2>
      <div style={styles.grid}>
        {categoriasPredeterminadas.map(cat => (
          <div key={cat.id} style={styles.card} onClick={() => navigate(`/dashboard?q=${cat.nombre}`)}>
            <div style={styles.iconContainer}>
              {cat.icon}
            </div>
            <h3 style={styles.title}>{cat.nombre}</h3>
            <p style={styles.subtitle}>Ver productos</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #f0f0f0'
  },
  iconContainer: {
    marginBottom: '15px'
  },
  title: {
    fontSize: '18px',
    color: '#333',
    margin: '0 0 5px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#aaa',
    margin: 0
  }
};

export default Categorias;
