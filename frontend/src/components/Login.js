import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User as UserIcon } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import clienteAxios from '../api/axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const respuesta = await clienteAxios.post('/auth/login', { email, password });
                localStorage.setItem('token', respuesta.data.token);
                navigate('/dashboard'); 
            } else {
                const respuesta = await clienteAxios.post('/auth/register', { nombre, email, password });
                // Auto-login after registration or ask to login
                setIsLogin(true);
                alert("Cuenta creada con éxito, por favor inicia sesión.");
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error de conexión');
        }
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-logo">
                        <Leaf color="#2ECC71" size={32} />
                        EcoDespensa
                    </div>
                    
                    <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>
                        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>
                    
                    {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <UserIcon className="input-icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Nombre completo" 
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)} 
                                    required 
                                />
                            </div>
                        )}
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email" 
                                placeholder="Correo electrónico" 
                                value={email}
                                onChange={e => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                value={password}
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <button type="submit" className="btn-primary">
                            {isLogin ? 'Entrar' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>O continúa con</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                                // Here you would send the token to your backend
                                // await clienteAxios.post('/auth/google', { token: credentialResponse.credential })
                                alert('Inicio con Google en modo simulación (Requiere configuración del backend)');
                                navigate('/dashboard');
                            }}
                            onError={() => {
                                setError('Error al iniciar sesión con Google');
                            }}
                        />
                    </div>

                    <div className="auth-switch">
                        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                        </span>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;