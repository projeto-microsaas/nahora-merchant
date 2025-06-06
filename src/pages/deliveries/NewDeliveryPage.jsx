import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewDeliveryPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Nova Entrega</h1>
      <p>Formulário para criar uma nova entrega será implementado aqui.</p>
      <button onClick={() => navigate('/deliveries')} style={{ padding: '10px 20px' }}>
        Voltar para o Dashboard
      </button>
    </div>
  );
};

export default NewDeliveryPage;