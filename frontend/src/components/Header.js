import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Bell, User, ShoppingCart, Search, LogOut, Package } from 'lucide-react';

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    
    const handleScroll = () => {
      setShowProfile(false);
      setShowCart(false);
      setShowNotif(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  return (
    <header className="app-header" ref={headerRef} style={styles.header}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div onClick={() => navigate('/dashboard')} style={{cursor: 'pointer', ...styles.logoContainer}}>
          <Leaf color="#2ECC71" size={28} />
          <h1 style={styles.logoText}>EcoDespensa</h1>
        </div>
        
        <div style={styles.actions} className="header-actions">
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button style={styles.iconButton} onClick={() => {setShowNotif(!showNotif); setShowCart(false); setShowProfile(false);}}>
              <Bell size={22} color={showNotif ? "#2ECC71" : "#777"} />
            </button>
            {showNotif && (
              <div style={{...styles.dropdown, right: '-50px'}}>
                <div style={styles.dropdownHeader}>Notificaciones</div>
                <div style={styles.dropdownItem}>
                  <div style={{color: '#e74c3c', fontWeight: 'bold'}}>¡Atención!</div>
                  <div style={{fontSize: '13px', color: '#555'}}>Tus manzanas espiran en 3 días.</div>
                </div>
              </div>
            )}
          </div>

          {/* Cart / Shopping List */}
          <div style={{ position: 'relative' }}>
            <button style={styles.iconButton} onClick={() => {setShowCart(!showCart); setShowNotif(false); setShowProfile(false);}}>
              <ShoppingCart size={22} color={showCart ? "#2ECC71" : "#777"} />
            </button>
            {showCart && (
              <div style={{...styles.dropdown, right: '-25px'}}>
                <div style={styles.dropdownHeader}>Lista de Compras</div>
                <div style={styles.dropdownItem}><Package size={14}/> Huevos (1 docena)</div>
                <div style={styles.dropdownItem}><Package size={14}/> Leche Entera</div>
                <div style={styles.dropdownItem}><Package size={14}/> Aceite de Oliva</div>
                <div style={{padding: '10px', textAlign: 'center'}}>
                  <button style={{...styles.dropdownBtn, width: '100%'}}>Ver lista completa</button>
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
                <div style={styles.dropdownItem}>Perfil</div>
                <div style={styles.dropdownItem}>Configuración</div>
                <div style={{...styles.dropdownItem, color: '#e74c3c'}} onClick={logout}>
                  <LogOut size={14} style={{marginRight: '5px'}}/> Cerrar sesión
                </div>
              </div>
            )}
          </div>
        </div>
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
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #eee',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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
    backgroundColor: '#F5F5F5',
    borderRadius: '25px',
    width: '400px',
    border: '1px solid #eee'
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '12px 15px',
    width: '100%',
    outline: 'none',
    fontSize: '15px'
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background 0.2s',
    outline: 'none'
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    width: '260px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    zIndex: 200,
    border: '1px solid #eee'
  },
  dropdownHeader: {
    padding: '12px 15px',
    backgroundColor: '#2ECC71',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px'
  },
  dropdownItem: {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  dropdownBtn: {
    backgroundColor: '#2ECC71',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Header;
