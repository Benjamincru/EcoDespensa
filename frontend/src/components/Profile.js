import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/axios';
import { 
  User, Mail, Settings, Shield, Bell, 
  Moon, Sun, LogOut, Award, ChevronRight,
  TrendingDown, Zap, PieChart, Edit2, X
} from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({ nombre: 'Benjamin', email: 'benjamin@example.com' });
  const [stats, setStats] = useState({ total: 0, caducados: 0, porVencer: 0 });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [editName, setEditName] = useState(user.nombre);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const statsRes = await clienteAxios.get('/products/stats');
        setStats(statsRes.data);
        
        // Scroll to settings if hash present
        if (window.location.hash === '#settings') {
          const el = document.getElementById('settings');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error("Error loading profile stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, nombre: editName });
    setShowEditModal(false);
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Cargando perfil...</div>;

  return (
    <div className="animate-fade-in" style={styles.container}>
      <header style={styles.header}>
        <div style={styles.profileAvatar}>
          <User size={40} color="white" />
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.userName}>{user.nombre}</h2>
          <div style={styles.userEmail}><Mail size={14} /> {user.email}</div>
        </div>
        <button className="btn-premium" style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px'}} onClick={() => setShowEditModal(true)}>
          <Edit2 size={18} /> Editar Perfil
        </button>
      </header>

      <div style={styles.contentGrid}>
        {/* Statistics Section */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Resumen de Actividad</h3>
          <div style={styles.statsRow}>
            <div className="premium-card" style={styles.miniStat}>
               <div style={{...styles.dot, backgroundColor: 'var(--primary-color)'}}></div>
               <div style={styles.miniVal}>{stats.total}</div>
               <div style={styles.miniLabel}>Total</div>
            </div>
            <div className="premium-card" style={styles.miniStat}>
               <div style={{...styles.dot, backgroundColor: 'var(--danger-color)'}}></div>
               <div style={styles.miniVal}>{stats.caducados}</div>
               <div style={styles.miniLabel}>Desperdicio</div>
            </div>
            <div className="premium-card" style={styles.miniStat}>
               <div style={{...styles.dot, backgroundColor: 'var(--warning-color)'}}></div>
               <div style={styles.miniVal}>{stats.porVencer}</div>
               <div style={styles.miniLabel}>En Riesgo</div>
            </div>
          </div>

          <div className="premium-card" style={styles.impactCard}>
            <div style={styles.impactIcon}><Zap color="#F59E0B" fill="#F59E0B" /></div>
            <div>
              <div style={styles.impactTitle}>Impacto Ecológico</div>
              <p style={styles.impactText}>Has evitado desperdiciar {stats.total * 0.5}kg de comida este mes. ¡Sigue así!</p>
            </div>
            <div style={styles.impactBadge}>Nivel 4</div>
          </div>
        </section>

        {/* Settings Section */}
        <section id="settings" style={styles.section}>
          <h3 style={styles.sectionTitle}>Ajustes y Preferencias</h3>
          <div className="premium-card" style={styles.settingsList}>
            <div style={styles.settingItem} onClick={() => setNotifEnabled(!notifEnabled)}>
               <div style={styles.settingIcon}><Bell size={18} /></div>
               <div style={styles.settingContent}>
                 <div style={styles.settingLabel}>Notificaciones Push</div>
                 <div style={styles.settingDesc}>{notifEnabled ? 'Activado' : 'Desactivado'} - Alertas diarias</div>
               </div>
               <div style={{...styles.toggle, backgroundColor: notifEnabled ? 'var(--primary-color)' : '#CBD5E1'}}>
                 <div style={{...styles.toggleCircle, transform: notifEnabled ? 'translateX(20px)' : 'translateX(0)'}}></div>
               </div>
            </div>
            <div style={styles.settingItem}>
               <div style={styles.settingIcon}><Shield size={18} /></div>
               <div style={styles.settingContent}>
                 <div style={styles.settingLabel}>Privacidad y Seguridad</div>
                 <div style={styles.settingDesc}>Gestiona tu cuenta y datos</div>
               </div>
               <ChevronRight size={18} color="#94A3B8" />
            </div>
            <div style={{...styles.settingItem, borderBottom: 'none'}} onClick={handleLogout}>
               <div style={{...styles.settingIcon, color: 'var(--danger-color)', backgroundColor: '#FEF2F2'}}><LogOut size={18} /></div>
               <div style={styles.settingContent}>
                 <div style={{...styles.settingLabel, color: 'var(--danger-color)'}}>Cerrar Sesión</div>
                 <div style={styles.settingDesc}>Salir de tu cuenta de forma segura</div>
               </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className="premium-card animate-scale-in" style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <h3 style={{margin: 0}}>Editar Perfil</h3>
              <button onClick={() => setShowEditModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'}}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div style={{marginBottom: '20px'}}>
                <label style={styles.modalLabel}>Nombre Completo</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  style={styles.modalInput} 
                  required
                />
              </div>
              <div style={{marginBottom: '25px'}}>
                <label style={styles.modalLabel}>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled
                  style={{...styles.modalInput, backgroundColor: '#f1f5f9', cursor: 'not-allowed'}} 
                />
                <p style={{fontSize: '12px', color: '#94a3b8', marginTop: '5px'}}>El correo no puede ser modificado por ahora.</p>
              </div>
              <button type="submit" className="btn-premium" style={{width: '100%', padding: '12px'}}>Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px 0'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    marginBottom: '40px',
    padding: '30px',
    background: 'var(--gradient-primary)',
    borderRadius: '24px',
    color: 'white',
    boxShadow: '0 20px 40px rgba(46, 204, 113, 0.2)'
  },
  profileAvatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '4px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  userName: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0
  },
  userEmail: {
    fontSize: '16px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-dark)'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  miniStat: {
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginBottom: '5px'
  },
  miniVal: {
    fontSize: '24px',
    fontWeight: '700'
  },
  miniLabel: {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  impactCard: {
    padding: '25px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    color: 'white'
  },
  impactIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '16px',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  impactTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '5px'
  },
  impactText: {
    fontSize: '14px',
    opacity: 0.7,
    lineHeight: '1.4'
  },
  impactBadge: {
    marginLeft: 'auto',
    backgroundColor: 'var(--primary-color)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700'
  },
  settingsList: {
    padding: '10px 0'
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 25px',
    borderBottom: '1px solid #F1F5F9',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  settingIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-light)'
  },
  settingContent: {
    flex: 1
  },
  settingLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-dark)'
  },
  settingDesc: {
    fontSize: '13px',
    color: 'var(--text-light)'
  },
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '20px',
    position: 'relative',
    transition: 'background 0.3s',
    padding: '2px'
  },
  toggleCircle: {
      width: '20px',
      height: '20px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.3s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    width: '90%',
    maxWidth: '400px',
    padding: '30px'
  },
  modalLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px'
  },
  modalInput: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none'
  }
};

export default Profile;
