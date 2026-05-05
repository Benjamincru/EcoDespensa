import React, { useEffect, useState } from 'react';
import clienteAxios from '../api/axios';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const res = await clienteAxios.get('/products');
                setProductos(res.data);
            } catch (error) {
                console.log("Error al obtener productos", error);
            }
        };
        obtenerProductos();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h3>Mi Inventario 📦</h3>
            {productos.length === 0 ? <p>No hay productos en tu despensa.</p> : (
                <ul>
                    {productos.map(p => (
                        <li key={p._id}>
                            <strong>{p.nombre}</strong> - {p.cantidad} unidades (Vence: {p.fechaCaducidad})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListaProductos;