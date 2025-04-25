const handleLogin = async () => {
  try {
    console.log('Dados enviados:', { email, password, role: 'merchant' });  // Adicionar log
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
      role: 'merchant',
    });
    
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('merchantInfo', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas');
    }
  } catch (err) {
    setError('Erro ao fazer login. Tente novamente.');
    console.error('Login error:', err);
  }
};



