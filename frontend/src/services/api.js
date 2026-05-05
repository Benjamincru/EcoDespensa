import axios from 'axios';

const api = axios.create({
    baseURL: 'http://TU_IP_LOCAL:3000/api', // Cambia TU_IP_LOCAL por la de tu PC
});

export default api;