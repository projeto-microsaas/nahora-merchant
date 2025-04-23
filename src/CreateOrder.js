import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const CreateOrder = () => {
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/orders', { client, description, value });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    }
  };

  return (
    <div className="create-order">
      <h2>Create Order</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreateOrder}>
        <div>
          <label>Client:</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Value:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default CreateOrder;
