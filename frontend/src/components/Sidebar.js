import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, Grid, Info } from 'lucide-react';

const Sidebar = () => {
  return (
    <nav className="sidebar-container" style={styles.sidebar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <NavLink to="/dashboard" className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-link-active" : "")} style={({ isActive }) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
            <Home size={20} /> Inicio
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/tienda" className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-link-active" : "")} style={({ isActive }) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
            <Store size={20} /> Tienda
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/categorias" className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-link-active" : "")} style={({ isActive }) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
            <Grid size={20} /> Categorías
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/sobre-nosotros" className={({ isActive }) => "sidebar-link" + (isActive ? " sidebar-link-active" : "")} style={({ isActive }) => isActive ? {...styles.link, ...styles.activeLink} : styles.link}>
            <Info size={20} /> Nosotros
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #eee',
    height: 'calc(100vh - 73px)', // Minus header height
    position: 'fixed',
    padding: '20px 0'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  navItem: {
    marginBottom: '5px'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 30px',
    color: '#777',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s border-right 0.2s',
    borderRight: '4px solid transparent'
  },
  activeLink: {
    color: '#2ECC71',
    backgroundColor: 'rgba(46, 204, 113, 0.05)',
    borderRight: '4px solid #2ECC71'
  }
};

export default Sidebar;
