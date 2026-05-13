import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import clienteAxios from '../api/axios';
import { 
  PackageOpen, AlertTriangle, AlertCircle, CheckCircle2, 
  Plus, Filter, Calendar, BarChart3, PieChart,
  ShoppingBag, Trash2, Edit2, Edit3,
  HandCoins, Droplets, Wind, Sprout,
  Clock, Utensils
} from 'lucide-react';

const Dashboard = () => {
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState({ total: 0, caducados: 0, porVencer: 0, seguros: 0 });
  const [categorias, setCategorias] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState({ dineroAhorrado: 0, co2: 0, agua: 0, puntosEco: 0 });
  const [recetas, setRecetas] = useState([]);
  const [filterType, setFilterType] = useState(null); // 'frescos', 'caducados', 'porVencer', 'seguros'
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('piezas');
  const [categoriaId, setCategoriaId] = useState('');
  const [fechaCaducidad, setFechaCaducidad] = useState('');
  const [editingId, setEditingId] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const catId = queryParams.get('catId') || null;

  // Helper to format date without timezone shift (YYYY-MM-DD -> DD/MM/YYYY)
  const formatLocalDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [prodRes, statsRes, catRes, impactRes, recipeRes] = await Promise.all([
        clienteAxios.get('/products'),
        clienteAxios.get('/products/stats'),
        clienteAxios.get('/categorias'),
        clienteAxios.get('/impact'),
        clienteAxios.get('/recipes/suggested')
      ]);
      setProductos(prodRes.data);
      setStats(statsRes.data);
      setCategorias(catRes.data);
      setImpactData(impactRes.data);
      setRecetas(recipeRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    let filtered = [...productos];

    // Priority 1: Filter by category ID if provided (from Categorias page)
    if (catId) {
      filtered = filtered.filter(p => p.categoria_id.toString() === catId.toString());
    } 
    
    // Priority 2: Filter by text query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const nameMatch = p.nombre.toLowerCase().includes(lowerQuery);
        const catMatch = p.Categoria && p.Categoria.nombre.toLowerCase().includes(lowerQuery);
        return nameMatch || catMatch;
      });
    }

    // Priority 3: Filter by Stat Type
    if (filterType) {
      filtered = filtered.filter(p => {
        const status = getStatus(p.fecha_caducidad);
        if (filterType === 'frescos') return !p.fecha_caducidad;
        return status.label.toLowerCase() === filterType.toLowerCase();
      });
    }

    setFilteredProductos(filtered);
  }, [searchQuery, catId, productos, filterType]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await clienteAxios.delete(`/products/${id}`);
        loadAll();
      } catch (error) {
        alert("Error al eliminar el producto: " + error.message);
      }
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setNombre(p.nombre);
    setCantidad(p.cantidad);
    setUnidad(p.unidad);
    setCategoriaId(p.categoria_id);
    setFechaCaducidad(p.fecha_caducidad);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(cantidad) <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
    }

    const payload = {
        nombre,
        cantidad: parseFloat(cantidad),
        unidad,
        categoria_id: parseInt(categoriaId),
        fecha_caducidad: fechaCaducidad
    };

    try {
      if (editingId) {
        await clienteAxios.put(`/products/${editingId}`, payload);
      } else {
        await clienteAxios.post('/products', payload);
      }
      setShowModal(false);
      resetForm();
      loadAll();
    } catch (error) {
      alert("Error al guardar el producto: " + error.message);
    }
  };

  const resetForm = () => {
    setNombre('');
    setCantidad('');
    setUnidad('piezas');
    setCategoriaId('');
    setFechaCaducidad('');
    setEditingId(null);
  };

  const getStatus = (fecha_caducidad) => {
    if (!fecha_caducidad) return { label: 'Fresco', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', icon: <PieChart size={18}/> };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(fecha_caducidad);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Caducado', color: '#EF4444', gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', icon: <AlertCircle size={18}/> };
    if (diffDays <= 3) return { label: 'Crítico', color: '#F59E0B', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', icon: <AlertTriangle size={18}/> };
    if (diffDays <= 7) return { label: 'Advertencia', color: '#3B82F6', gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', icon: <Calendar size={18}/> };
    return { label: 'Seguro', color: '#10B981', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', icon: <CheckCircle2 size={18}/> };
  };

  if (loading) return <div style={styles.loading}>Cargando tu despensa...</div>;

  return (
    <>
      <div className="animate-fade-in" style={styles.container}>
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>Hola, Benjamin 👋</h2>
            <p style={styles.subtitle}>Aquí tienes el estado actual de tu EcoDespensa.</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-premium">
            <Plus size={20} /> Nuevo Producto
          </button>
        </header>
        
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div className="premium-card stat-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <div style={styles.statIcon}><ShoppingBag color="var(--primary-color)" /></div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total en dispensa</div>
          </div>
          <div 
            onClick={() => setFilterType(filterType === 'frescos' ? null : 'frescos')} 
            className="premium-card stat-card" 
            style={{ borderLeft: '4px solid #8B5CF6', cursor: 'pointer', transform: filterType === 'frescos' ? 'scale(1.02)' : 'none', boxShadow: filterType === 'frescos' ? '0 10px 15px -3px rgba(139, 92, 246, 0.2)' : 'none' }}
          >
            <div style={styles.statIcon}><PieChart color="#8B5CF6" /></div>
            <div style={styles.statValue}>{stats.frescos}</div>
            <div style={styles.statLabel}>Productos frescos</div>
          </div>
          <div 
            onClick={() => setFilterType(filterType === 'caducados' ? null : 'caducados')} 
            className="premium-card stat-card" 
            style={{ borderLeft: '4px solid var(--danger-color)', cursor: 'pointer', transform: filterType === 'caducados' ? 'scale(1.02)' : 'none' }}
          >
            <div style={styles.statIcon}><AlertCircle color="var(--danger-color)" /></div>
            <div style={styles.statValue}>{stats.caducados}</div>
            <div style={styles.statLabel}>Productos caducados</div>
          </div>
          <div 
            onClick={() => setFilterType(filterType === 'crítico' ? null : 'crítico')} 
            className="premium-card stat-card" 
            style={{ borderLeft: '4px solid var(--warning-color)', cursor: 'pointer', transform: filterType === 'crítico' ? 'scale(1.02)' : 'none' }}
          >
            <div style={styles.statIcon}><AlertTriangle color="var(--warning-color)" /></div>
            <div style={styles.statValue}>{stats.porVencer}</div>
            <div style={styles.statLabel}>Por vencer (7 días)</div>
          </div>
          <div 
            onClick={() => setFilterType(filterType === 'seguro' ? null : 'seguro')} 
            className="premium-card stat-card" 
            style={{ borderLeft: '4px solid var(--safe-color)', cursor: 'pointer', transform: filterType === 'seguro' ? 'scale(1.02)' : 'none' }}
          >
            <div style={styles.statIcon}><CheckCircle2 color="var(--safe-color)" /></div>
            <div style={styles.statValue}>{stats.seguros}</div>
            <div style={styles.statLabel}>En buen estado</div>
          </div>
        </div>

        {/* Impact Center */}
        <section style={styles.impactSection}>
          <div style={styles.impactHeader}>
            <h3 style={styles.sectionTitle}>Centro de Impacto Eco</h3>
            <p style={styles.impactSubtitle}>Tu huella positiva en el planeta y tu bolsillo.</p>
          </div>
          <div style={styles.impactGrid}>
             <div style={{...styles.impactCard, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'}}>
                <HandCoins color="#059669" size={24} />
                <div>
                  <div style={styles.impactValue}>${impactData.dineroAhorrado}</div>
                  <div style={styles.impactLabel}>Ahorro Estimado</div>
                </div>
             </div>
             <div style={{...styles.impactCard, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'}}>
                <Droplets color="#2563EB" size={24} />
                <div>
                  <div style={styles.impactValue}>{impactData.agua}L</div>
                  <div style={styles.impactLabel}>Agua Preservada</div>
                </div>
             </div>
             <div style={{...styles.impactCard, background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)'}}>
                <Wind color="#DB2777" size={24} />
                <div>
                  <div style={styles.impactValue}>{impactData.co2}kg</div>
                  <div style={styles.impactLabel}>CO2 Prevenido</div>
                </div>
             </div>
             <div style={{...styles.impactCard, background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'}}>
                <Sprout color="#D97706" size={24} />
                <div>
                  <div style={styles.impactValue}>{impactData.puntosEco}</div>
                  <div style={styles.impactLabel}>Eco-Puntos</div>
                </div>
             </div>
          </div>
        </section>

        {/* AI Recipes Section */}
        <section style={{marginBottom: '40px'}}>
          <div style={styles.impactHeader}>
            <h3 style={styles.sectionTitle}>Eco-Recetas Sugeridas ✨</h3>
            <p style={styles.impactSubtitle}>Platos basados en productos que necesitan aprovecharse pronto.</p>
          </div>
          <div style={styles.recipeGrid}>
            {recetas.map((r, i) => (
              <div key={i} className="premium-card" style={styles.recipeCard}>
                <img src={r.imagen} alt={r.nombre} style={styles.recipeImg} />
                <div style={styles.recipeBadge}>AI Suggested</div>
                <div style={styles.recipeContent}>
                  <h4 style={styles.recipeName}>{r.nombre}</h4>
                  <p style={styles.recipeDesc}>{r.descripcion}</p>
                  <div style={styles.recipeMeta}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}><Utensils size={14}/> {r.ingredientes?.join(', ')}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Clock size={14}/> {r.tiempo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.sectionHeader}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <h3 style={styles.sectionTitle}>
              {searchQuery || catId || filterType ? `Resultados` : 'Inventario Reciente'}
            </h3>
            {(searchQuery || catId || filterType) && (
              <button 
                onClick={() => { setFilterType(null); window.location.href = '/dashboard'; }}
                style={{...styles.filterBtn, color: 'var(--danger-color)', border: '1px solid var(--danger-color)'}}
              >
                Limpiar filtros
              </button>
            )}
          </div>
          <div style={styles.filters}>
            <button style={styles.filterBtn}><Filter size={16}/> Filtrar</button>
            <button style={styles.filterBtn}><BarChart3 size={16}/> Ordenar</button>
          </div>
        </div>

        {/* Products Grid */}
        <div style={styles.inventoryGrid}>
          {filteredProductos.length === 0 ? (
            <div style={styles.emptyState}>
              <PackageOpen size={48} color="#CBD5E1" />
              <p>No hay productos que coincidan.</p>
            </div>
          ) : (
            filteredProductos.map(p => {
              const status = getStatus(p.fecha_caducidad);
              return (
                <div key={p.id} className="premium-card" style={styles.productCard}>
                  <div style={{...styles.statusBadge, backgroundColor: status.color + '15', color: status.color}}>
                     {status.icon} <span>{status.label}</span>
                  </div>
                  
                  <h4 style={styles.prodName}>{p.nombre}</h4>
                  
                  <div style={styles.prodMeta}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Cantidad:</span> {p.cantidad} {p.unidad}
                    </div>
                    <div style={styles.metaItem}>
                      <span style={styles.metaLabel}>Categoría:</span> {p.Categoria ? p.Categoria.nombre : 'General'}
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <div style={styles.expiryBox}>
                      <Calendar size={14} /> 
                      {p.fecha_caducidad ? formatLocalDate(p.fecha_caducidad) : 'Consumo inmediato'}
                    </div>
                    <div style={styles.cardActions}>
                      <button onClick={() => handleEdit(p)} style={styles.actionBtn}><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} style={{...styles.actionBtn, color: '#FCA5A5'}}><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL - Moved outside to guarantee absolute/fixed viewport centering */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className="premium-card" style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Producto</label>
                <input 
                  type="text" 
                  placeholder="Ej. Leche Entera" 
                  style={styles.input}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Cantidad</label>
                  <input 
                    type="number" 
                    min="1"
                    style={styles.input}
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value)}
                    required 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Unidad</label>
                  <select 
                    style={styles.input}
                    value={unidad}
                    onChange={e => setUnidad(e.target.value)}
                  >
                    <option value="piezas">piezas</option>
                    <option value="kg">kg</option>
                    <option value="litros">litros</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Categoría</label>
                <select 
                  style={styles.input}
                  value={categoriaId}
                  onChange={e => setCategoriaId(e.target.value)}
                  required
                >
                  <option value="">Selecciona...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha de Caducidad</label>
                <input 
                   type="date" 
                   value={fechaCaducidad}
                   onChange={e => setFechaCaducidad(e.target.value)}
                   style={styles.input} 
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-premium" style={{flex: 1}}>Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: { padding: '10px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
  title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' },
  subtitle: { color: 'var(--text-light)', fontSize: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statIcon: { marginBottom: '15px' },
  statValue: { fontSize: '32px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' },
  statLabel: { color: 'var(--text-light)', fontSize: '14px', fontWeight: '500' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', fontWeight: '600' },
  filters: { display: 'flex', gap: '10px' },
  filterBtn: { background: 'white', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-light)', transition: 'all 0.2s' },
  inventoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
  productCard: { padding: '24px', position: 'relative' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', marginBottom: '15px' },
  prodName: { fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-dark)' },
  prodMeta: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  metaItem: { fontSize: '14px', color: 'var(--text-dark)' },
  metaLabel: { color: 'var(--text-light)', fontWeight: '500' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #F1F5F9' },
  expiryBox: { fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '6px' },
  cardActions: { display: 'flex', gap: '8px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '5px', transition: 'color 0.2s' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '95%', maxWidth: '500px', padding: '35px', position: 'relative' },
  modalTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '25px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s' },
  modalFooter: { display: 'flex', gap: '15px', marginTop: '30px' },
  cancelBtn: { flex: 1, background: '#F1F5F9', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '18px', color: 'var(--text-light)' },
  emptyState: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: 'var(--text-light)' },
  impactSection: { marginBottom: '40px', padding: '25px', backgroundColor: '#F8FAFC', borderRadius: '24px' },
  impactHeader: { marginBottom: '20px' },
  impactSubtitle: { color: '#64748B', fontSize: '14px' },
  impactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  impactCard: { display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.02)' },
  impactValue: { fontSize: '20px', fontWeight: '700', color: '#1E293B' },
  impactLabel: { fontSize: '12px', color: '#64748B', fontWeight: '500' },
  recipeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
  recipeCard: { overflow: 'hidden', padding: 0, position: 'relative' },
  recipeImg: { width: '100%', height: '180px', objectFit: 'cover' },
  recipeBadge: { position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(46, 204, 113, 0.9)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  recipeContent: { padding: '20px' },
  recipeName: { fontSize: '18px', fontWeight: '700', marginBottom: '10px' },
  recipeDesc: { fontSize: '14px', color: '#64748B', marginBottom: '15px', lineHeight: '1.5' },
  recipeMeta: { display: 'flex', gap: '15px', fontSize: '13px', color: '#94A3B8' }
};

export default Dashboard;
