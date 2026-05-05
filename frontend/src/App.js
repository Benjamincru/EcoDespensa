import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Categorias from './components/Categorias';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Layout wrapper for authenticated pages
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main className="main-content" style={{ marginLeft: '250px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Authenticated Routes wrapped in Layout */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/tienda" element={<MainLayout><div><h2>Tienda (En desarrollo)</h2></div></MainLayout>} />
        <Route path="/categorias" element={<MainLayout><Categorias /></MainLayout>} />
        <Route path="/sobre-nosotros" element={<MainLayout><div><h2>Sobre Nosotros</h2><p>EcoDespensa es un sistema para reducir el desperdicio de comida.</p></div></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;