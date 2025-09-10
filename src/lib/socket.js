// /app/src/lib/socket.js
import { io } from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
  path: '/socket.io',
  auth: {
    token: localStorage.getItem('authToken'),
  },
  transports: ['websocket'],
});

socket.on('connect', () => console.log('Conectado ao servidor WebSocket'));
socket.on('connect_error', (error) => console.error('Erro na conexão WebSocket:', error.message));
socket.on('newDelivery', (data) => console.log('Nova entrega:', data));
socket.on('newDeliveryScheduled', (data) => console.log('Entrega agendada:', data));
socket.on('deliveryUpdate', (data) => console.log('Atualização de entrega:', data));

export default socket;