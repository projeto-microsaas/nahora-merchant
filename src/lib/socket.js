import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: true,
  path: '/socket.io',
  auth: {
    token: localStorage.getItem('authToken'),
  },
  transports: ['websocket'],
  timeout: 30000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  socket.auth.token = localStorage.getItem('authToken'); // Refresh token
  console.log('Conectado ao servidor WebSocket:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Erro na conexão WebSocket:', error.message);
});

socket.on('newDelivery', (data) => console.log('Nova entrega:', data));
socket.on('newDeliveryScheduled', (data) => console.log('Entrega agendada:', data));
socket.on('deliveryUpdate', (data) => console.log('Atualização de entrega:', data));

export default socket;