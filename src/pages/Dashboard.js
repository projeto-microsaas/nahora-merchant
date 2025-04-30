import React, { useState, useEffect } from "react";
     import { useNavigate } from "react-router-dom";
     import { toast } from "../components/ui/sonner";
     import { fetchDrivers, fetchOrders } from "../api/api";
     import DashboardHeader from "../components/dashboard/DashboardHeader";
     import DashboardStats from "../components/dashboard/DashboardStats";
     import OrderForm from "../components/dashboard/OrderForm";
     import OrderList from "../components/dashboard/OrderList";

     const Dashboard = () => {
       const navigate = useNavigate();
       const [user, setUser] = useState(null);
       const [drivers, setDrivers] = useState([]);
       const [orders, setOrders] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState("");

       useEffect(() => {
         console.log('Carregando Dashboard, verificando token...');
         const authToken = localStorage.getItem("authToken");
         const userData = localStorage.getItem("user");
         console.log('authToken encontrado no Dashboard:', authToken);
         console.log('userData encontrado no Dashboard:', userData);
         
         if (!authToken || !userData) {
           console.log('Token ou userData não encontrados, redirecionando para login');
           toast.error("Sessão expirada ou inválida");
           navigate("/");
           return;
         }

         try {
           const parsedUser = JSON.parse(userData);
           console.log('Usuário parseado:', parsedUser);
           setUser(parsedUser);
           
           loadData();
         } catch (e) {
           console.error("Erro ao processar dados do usuário:", e);
           localStorage.removeItem("authToken");
           localStorage.removeItem("user");
           navigate("/");
         }
       }, [navigate]);

       const loadData = async () => {
         setLoading(true);
         try {
           console.log('Carregando motoristas...');
           const driversResponse = await fetchDrivers();
           console.log('Motoristas recebidos:', driversResponse.data);
           setDrivers(driversResponse.data);
           
           console.log('Carregando pedidos...');
           const ordersResponse = await fetchOrders();
           console.log('Pedidos recebidos:', ordersResponse.data);
           setOrders(ordersResponse.data);
         } catch (err) {
           console.error("Erro ao carregar dados:", err);
           if (err.response?.status === 401) {
             setError("Sessão expirada. Você será redirecionado para o login.");
             localStorage.removeItem("authToken");
             localStorage.removeItem("user");
             setTimeout(() => navigate("/"), 2000);
             return;
           }
           setError("Erro ao carregar dados. Tente novamente mais tarde.");
         } finally {
           setLoading(false);
         }
       };

       const handleOrderCreated = (newOrder) => {
         console.log('Novo pedido criado:', newOrder);
         setOrders((prev) => [...prev, newOrder]);
       };

       if (loading && !user) {
         return <div className="flex justify-center items-center h-screen">Carregando...</div>;
       }

       return (
         <div className="container mx-auto p-4">
           <DashboardHeader user={user} />
           
           {error && <p className="text-red-500 mb-4">{error}</p>}

           <DashboardStats user={user} orders={orders} />
           
           <OrderForm 
             drivers={drivers} 
             onOrderCreated={handleOrderCreated} 
           />

           <OrderList orders={orders} drivers={drivers} />
         </div>
       );
     };

     export default Dashboard;
