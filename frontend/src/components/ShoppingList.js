import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  RefreshCw, ShoppingBag, PackageOpen, ListChecks
} from 'lucide-react';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [syncing, setSyncing] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await clienteAxios.get('/list');
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      const res = await clienteAxios.post('/list', { nombre_producto: newItemName, cantidad: 1 });
      setItems([...items, res.data]);
      setNewItemName('');
    } catch (error) {
      alert("Error al añadir item");
    }
  };

  const handleToggleBought = async (id) => {
    try {
      const res = await clienteAxios.put(`/list/${id}/toggle`);
      setItems(items.map(item => item.id === id ? res.data : item));
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await clienteAxios.delete(`/list/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await clienteAxios.post('/list/sync');
      if (res.data.agregados > 0) {
        alert(`Se han añadido ${res.data.agregados} productos que se están agotando.`);
        fetchList();
      } else {
        alert("Tu lista ya está sincronizada con tu inventario.");
      }
    } catch (error) {
      alert("Error al sincronizar");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div style={styles.loading}>Cargando tu lista...</div>;

  const boughtItems = items.filter(i => i.comprado);
  const pendingItems = items.filter(i => !i.comprado);

  return (
    <div className="animate-fade-in" style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Lista de Compras Inteligente</h2>
          <p style={styles.subtitle}>Gestiona los productos que necesitas reponer.</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="btn-premium" 
          style={{...styles.syncBtn, background: syncing ? '#94A3B8' : 'var(--primary-color)'}}
        >
          <RefreshCw size={18} className={syncing ? 'spin' : ''} /> 
          {syncing ? 'Sincronizando...' : 'Auto-Sincronizar'}
        </button>
      </header>

      <div style={styles.contentGrid}>
        {/* Input Section */}
        <div className="premium-card" style={styles.inputCard}>
          <h3 style={styles.cardTitle}>Añadir Manualmente</h3>
          <form onSubmit={handleAddItem} style={styles.addForm}>
            <input 
              type="text" 
              placeholder="Ej: Manzanas, Jabón..." 
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.addBtn}>
              <Plus size={20} />
            </button>
          </form>
          
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <span style={styles.statVal}>{pendingItems.length}</span>
              <span style={styles.statLab}>Pendientes</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statVal}>{boughtItems.length}</span>
              <span style={styles.statLab}>Comprados</span>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div style={styles.listSection}>
          {items.length === 0 ? (
            <div style={styles.emptyState}>
              <ListChecks size={64} color="#CBD5E1" />
              <h3>Tu lista está vacía</h3>
              <p>Añade items manuales o usa el botón de Sincronizar.</p>
            </div>
          ) : (
            <>
              {pendingItems.length > 0 && (
                <div style={styles.subList}>
                  <h4 style={styles.subTitle}>Pendientes ({pendingItems.length})</h4>
                  {pendingItems.map(item => (
                    <div key={item.id} className="premium-card" style={styles.listItem}>
                      <button onClick={() => handleToggleBought(item.id)} style={styles.checkBtn}>
                        <Circle size={20} color="#94A3B8" />
                      </button>
                      <span style={styles.itemName}>{item.nombre_producto}</span>
                      <button onClick={() => handleDeleteItem(item.id)} style={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {boughtItems.length > 0 && (
                <div style={{...styles.subList, marginTop: '30px', opacity: 0.7}}>
                  <h4 style={styles.subTitle}>Ya comprados</h4>
                  {boughtItems.map(item => (
                    <div key={item.id} className="premium-card" style={{...styles.listItem, background: '#F8FAFC'}}>
                      <button onClick={() => handleToggleBought(item.id)} style={styles.checkBtn}>
                        <CheckCircle2 size={20} color="var(--primary-color)" />
                      </button>
                      <span style={{...styles.itemName, textDecoration: 'line-through', color: '#94A3B8'}}>
                        {item.nombre_producto}
                      </span>
                      <button onClick={() => handleDeleteItem(item.id)} style={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px 0' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
  title: { fontSize: '28px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' },
  subtitle: { color: 'var(--text-light)', fontSize: '16px' },
  syncBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px' },
  contentGrid: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' },
  inputCard: { padding: '25px', height: 'fit-content', position: 'sticky', top: '100px' },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '20px' },
  addForm: { display: 'flex', gap: '10px', marginBottom: '25px' },
  input: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' },
  addBtn: { backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' },
  statsRow: { display: 'flex', justifyContent: 'space-around', paddingTop: '20px', borderTop: '1px solid #F1F5F9' },
  stat: { textAlign: 'center' },
  statVal: { display: 'block', fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' },
  statLab: { fontSize: '12px', color: 'var(--text-light)', fontWeight: '500' },
  listSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  subTitle: { fontSize: '15px', fontWeight: '600', color: '#64748B', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  listItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', marginBottom: '10px' },
  checkBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  itemName: { flex: 1, fontSize: '16px', fontWeight: '500', color: '#1E293B' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: '5px', transition: 'color 0.2s' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#64748B' },
  emptyState: { textAlign: 'center', padding: '80px 0', color: '#94A3B8' },
  subList: { animation: 'slideUp 0.3s ease-out' }
};

export default ShoppingList;
