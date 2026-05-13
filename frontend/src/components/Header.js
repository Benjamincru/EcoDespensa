import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Bell, User, ShoppingCart, Search, LogOut, Package, AlertCircle } from 'lucide-react';
import clienteAxios from '../api/axios';

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertas, setAlertas] = useState([]);
  const [listaCompras, setListaCompras] = useState([]);
  const navigate = useNavigate();
  const headerRef = useRef(null);

  // Close dropdowns on scroll or click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowProfile(false);
        setShowCart(false);
        setShowNotif(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchCart();
    const interval = setInterval(() => {
      fetchAlerts();
      fetchCart();
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await clienteAxios.get('/products/alerts');
      setAlertas(res.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await clienteAxios.get('/list');
      setListaCompras(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/dashboard`);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getDaysDiff = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <header className="app-header glass" ref={headerRef} style={styles.header}>
      <div className="header-logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer', ...styles.logoContainer}}>
        <Leaf color="#2ECC71" size={28} />
        <h1 style={styles.logoText}>EcoDespensa</h1>
      </div>

      <form onSubmit={handleSearch} className="search-container" style={styles.searchContainer}>
        <Search size={18} color="#aaa" style={{ marginLeft: 15 }} />
        <input 
          type="text" 
          placeholder="¿Qué buscas en tu despensa?" 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      
      <div style={styles.actions} className="header-actions">
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button style={styles.iconButton} onClick={() => {setShowNotif(!showNotif); setShowCart(false); setShowProfile(false);}}>
            <Bell size={22} color={showNotif ? "#2ECC71" : "#777"} />
            {alertas.length > 0 && <span style={styles.notifBadge}>{alertas.length}</span>}
          </button>
          {showNotif && (
            <div style={{...styles.dropdown, right: '-50px'}}>
              <div style={styles.dropdownHeader}>Notificaciones</div>
              {alertas.length === 0 ? (
                <div style={styles.dropdownItem}>No hay alertas recientes</div>
              ) : (
                alertas.map(a => {
                   const days = getDaysDiff(a.fecha_caducidad);
                   return (
                    <div 
                      key={a.id} 
                      style={styles.dropdownItem} 
                      onClick={() => {
                        navigate(`/dashboard?q=${encodeURIComponent(a.nombre)}`);
                        setShowNotif(false);
                      }}
                    >
                      <div style={{color: days < 0 ? '#ef4444' : '#f59e0b', fontWeight: 'bold'}}>
                        {days < 0 ? '¡Caducado!' : '¡Próximo a vencer!'}
                      </div>
                      <div style={{fontSize: '13px', color: '#555'}}>
                        {a.nombre} {days < 0 ? 'venció hace ' + Math.abs(days) : 'vence en ' + days} días.
                      </div>
                    </div>
                   );
                })
              )}
            </div>
          )}
        </div>

        {/* Cart / Shopping List */}
        <div style={{ position: 'relative' }}>
          <button style={styles.iconButton} onClick={() => {setShowCart(!showCart); setShowNotif(false); setShowProfile(false);}}>
            <ShoppingCart size={22} color={showCart ? "#2ECC71" : "#777"} />
            {listaCompras.filter(i => !i.comprado).length > 0 && (
              <span style={styles.notifBadge}>{listaCompras.filter(i => !i.comprado).length}</span>
            )}
          </button>
          {showCart && (
            <div style={{...styles.dropdown, right: '-25px'}}>
              <div style={styles.dropdownHeader}>Lista de Compras</div>
              <div style={styles.cartItemsContainer}>
                {listaCompras.filter(i => !i.comprado).length === 0 ? (
                  <div style={styles.dropdownItem}>No hay items pendientes</div>
                ) : (
                  listaCompras.filter(i => !i.comprado).slice(0, 5).map(item => (
                    <div key={item.id} style={styles.dropdownItem}>
                      <Package size={14} style={{marginRight: '8px'}}/> {item.nombre_producto}
                    </div>
                  ))
                )}
                {listaCompras.filter(i => !i.comprado).length > 5 && (
                  <div style={{...styles.dropdownItem, textAlign: 'center', fontSize: '12px', color: '#888'}}>
                    + {listaCompras.filter(i => !i.comprado).length - 5} más...
                  </div>
                )}
              </div>
              <div style={{padding: '10px', textAlign: 'center'}}>
                <button 
                  onClick={() => { navigate('/shopping-list'); setShowCart(false); }}
                  style={{...styles.dropdownBtn, width: '100%'}}
                >
                  Ver lista completa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button style={styles.iconButton} onClick={() => {setShowProfile(!showProfile); setShowNotif(false); setShowCart(false);}}>
            <User size={22} color={showProfile ? "#2ECC71" : "#777"} />
          </button>
          {showProfile && (
            <div style={{...styles.dropdown, right: 0}}>
              <div style={styles.dropdownHeader}>Mi Cuenta</div>
              <div style={styles.dropdownItem} onClick={() => navigate('/perfil')}>Perfil</div>
              <div style={styles.dropdownItem} onClick={() => navigate('/perfil#settings')}>Configuración</div>
              <div style={{...styles.dropdownItem, color: '#e74c3c'}} onClick={logout}>
                <LogOut size={14} style={{marginRight: '5px'}}/> Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoText: {
    color: '#2ECC71',
    fontSize: '22px',
    fontWeight: '700',
    margin: 0
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: '25px',
    width: '400px',
    border: '1px solid #E2E8F0'
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '12px 15px',
    width: '100%',
    outline: 'none',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  notifBadge: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    border: '2px solid white'
  },
  dropdown: {
    position: 'absolute',
    top: '50px',
    width: '280px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    zIndex: 200,
    border: '1px solid #F1F5F9'
  },
  dropdownHeader: {
    padding: '15px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    fontWeight: '600',
    fontSize: '15px'
  },
  dropdownItem: {
    padding: '15px',
    borderBottom: '1px solid #F1F5F9',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#444',
    transition: 'background 0.2s'
  },
  dropdownBtn: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Header;
