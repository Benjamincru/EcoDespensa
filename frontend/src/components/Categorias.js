import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Apple, Carrot, Milk, Wheat, Coffee, Leaf, Archive, 
  Package, Beef, HelpCircle, ChevronRight
} from 'lucide-react';
import clienteAxios from '../api/axios';

const iconMap = {
  Milk: <Milk size={32} />,
  Apple: <Apple size={32} />,
  Beef: <Beef size={32} />,
  Package: <Package size={32} />,
  Coffee: <Coffee size={32} />,
  Archive: <Archive size={32} />,
  Carrot: <Carrot size={32} />,
  Leaf: <Leaf size={32} />,
  HelpCircle: <HelpCircle size={32} />
};

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await clienteAxios.get('/categorias');
        setCategorias(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Cargando categorías...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={styles.title}>Categorías de tu Despensa</h2>
      <p style={styles.subtitle}>Explora tus productos por tipo para un mejor control.</p>
      
      <div style={styles.grid}>
        {categorias.map(cat => (
          <div 
            key={cat.id} 
            className="premium-card" 
            style={styles.card} 
            onClick={() => navigate(`/dashboard?catId=${cat.id}&q=${cat.nombre}`)}
          >
            <div style={{...styles.iconWrapper, backgroundColor: 'var(--primary-color)15', color: 'var(--primary-color)'}}>
              {iconMap[cat.icono] || <Package size={32} />}
            </div>
            <h3 style={styles.catName}>{cat.nombre}</h3>
            <div style={styles.cardFooter}>
              <span>Explorar</span>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  subtitle: {
    color: 'var(--text-light)',
    marginBottom: '35px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '25px'
  },
  card: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  catName: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '20px',
    color: 'var(--text-dark)'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: 'var(--primary-color)',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Categorias;
