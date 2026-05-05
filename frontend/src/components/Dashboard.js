import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clienteAxios from '../api/axios';
import { PackageOpen, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  
  // Extraer el texto de busqueda de la URL (Ej: /dashboard?q=manzana)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    // Cuando el searchQuery o los productos cambian, filtramos arreglamos localmente.
    if (searchQuery.trim() === '') {
      setFilteredProductos(productos);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = productos.filter(p => p.nombre.toLowerCase().includes(lowerQuery));
      setFilteredProductos(filtered);
    }
  }, [searchQuery, productos]);

  const fetchProductos = async () => {
    try {
      const res = await clienteAxios.get('/products');
      if (res.data.length > 0) {
        setProductos(res.data);
      } else {
         throw new Error("Empty");
      }
    } catch (error) {
      // Mock data
      setProductos([
        { id: 1, nombre: 'Manzanas', cantidad: 5, unidad: 'kg', fecha_caducidad: new Date(Date.now() + 86400000 * 5).toISOString() },
        { id: 2, nombre: 'Leche Deslactosada', cantidad: 2, unidad: 'litros', fecha_caducidad: new Date(Date.now() + 86400000 * 2).toISOString() },
        { id: 3, nombre: 'Queso Panela', cantidad: 1, unidad: 'pieza', fecha_caducidad: new Date(Date.now() - 86400000 * 1).toISOString() },
        { id: 4, nombre: 'Huevos Rojos', cantidad: 12, unidad: 'pieza', fecha_caducidad: new Date(Date.now() + 86400000 * 15).toISOString() },
      ]);
    }
  };

  const getStatus = (fecha_caducidad) => {
    const faltanDias = Math.ceil((new Date(fecha_caducidad) - new Date()) / (1000 * 60 * 60 * 24));
    if (faltanDias < 0) return { label: 'Caducado', color: 'var(--danger-color)', icon: <AlertCircle size={20}/>, class: 'status-danger' };
    if (faltanDias <= 3) return { label: 'Crítico', color: 'var(--warning-color)', icon: <AlertTriangle size={20}/>, class: 'status-warning' };
    return { label: 'Seguro', color: 'var(--safe-color)', icon: <CheckCircle2 size={20}/>, class: 'status-safe' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2>{searchQuery ? `Resultados de: "${searchQuery}"` : 'Mi Inventario'}</h2>
        <button onClick={() => setShowModal(true)} style={{...styles.addBtn, transition: 'all 0.2s', cursor: 'pointer'}}>+ Agregar Producto</button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{marginTop: 0}}>Agregar Nuevo Producto</h3>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Nombre del producto" style={styles.input} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="number" placeholder="Cantidad" style={styles.input} />
              <select style={styles.input}>
                <option>kg</option>
                <option>litros</option>
                <option>piezas</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555'}}>Fecha de Caducidad</label>
              <input type="date" style={styles.input} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{...styles.addBtn, flex: 1}} onClick={() => {
                alert('Producto guardado (Simulación)');
                setShowModal(false);
              }}>Guardar</button>
              <button style={{...styles.addBtn, flex: 1, backgroundColor: '#e74c3c'}} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {filteredProductos.length === 0 ? (
          <p style={{ color: '#777' }}>No se encontraron productos.</p>
        ) : (
          filteredProductos.map(p => {
            const status = getStatus(p.fecha_caducidad);
            return (
              <div key={p.id} style={{...styles.card, borderTop: `4px solid ${status.color}` }}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.productName}><PackageOpen size={18} color="#777"/> {p.nombre}</h3>
                  <span style={{ color: status.color, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '14px' }}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <div style={styles.cardBody}>
                  <p><strong>Cantidad:</strong> {p.cantidad} {p.unidad}</p>
                  <p><strong>Caduca:</strong> {new Date(p.fecha_caducidad).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const styles = {
  addBtn: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  productName: {
    margin: 0,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#333'
  },
  cardBody: {
    color: '#555',
    fontSize: '15px',
    lineHeight: '1.6'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none'
  }
};

export default Dashboard;
