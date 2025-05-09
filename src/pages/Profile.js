import React, { useState, useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';
     import { getUser, updateUser } from '../api/api.js';

     const Profile = () => {
       const [user, setUser] = useState(null);
       const [name, setName] = useState('');
       const [email, setEmail] = useState('');
       const [error, setError] = useState('');
       const [success, setSuccess] = useState('');
       const navigate = useNavigate();

       useEffect(() => {
         const fetchUser = async () => {
           try {
             const userData = await getUser();
             setUser(userData);
             setName(userData.name);
             setEmail(userData.email);
           } catch (err) {
             console.error('Erro ao carregar usuário:', err);
             if (err.response && err.response.status === 401) {
               localStorage.removeItem('token');
               navigate('/');
             } else {
               setError('Erro ao carregar dados do usuário.');
             }
           }
         };
         fetchUser();
       }, [navigate]);

       const handleUpdate = async (e) => {
         e.preventDefault();
         try {
           setError('');
           setSuccess('');
           const updatedUser = await updateUser({ name, email });
           setUser(updatedUser.user);
           setSuccess('Perfil atualizado com sucesso!');
         } catch (err) {
           console.error('Erro ao atualizar perfil:', err);
           if (err.response && err.response.status === 401) {
             localStorage.removeItem('token');
             navigate('/');
           } else {
             setError('Erro ao atualizar perfil. Tente novamente.');
           }
         }
       };

       const handleLogout = () => {
         localStorage.removeItem('token');
         navigate('/');
         window.location.href = '/';
       };

       return (
         <div className="container mt-5">
           <h2>Perfil</h2>
           {error && <div className="alert alert-danger">{error}</div>}
           {success && <div className="alert alert-success">{success}</div>}
           {user && (
             <form onSubmit={handleUpdate}>
               <div className="mb-3">
                 <label>Nome</label>
                 <input
                   type="text"
                   className="form-control"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
               </div>
               <div className="mb-3">
                 <label>Email</label>
                 <input
                   type="email"
                   className="form-control"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <button type="submit" className="btn btn-primary">
                 Atualizar Perfil
               </button>
             </form>
           )}
           <button className="btn btn-danger mt-3" onClick={handleLogout}>
             Sair
           </button>
         </div>
       );
     };

     export default Profile;