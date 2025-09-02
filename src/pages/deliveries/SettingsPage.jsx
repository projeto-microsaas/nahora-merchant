import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch"; // Importação corrigida via index.jsx
import { Checkbox } from "../../components/ui/checkbox"; // Alternativa
import styles from "./SettingsPage.module.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "../../lib/axios";
import { io } from "socket.io-client";

// Funções de validação
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  return true;
};

const SettingsPage = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", cpf: "" });
  const [security, setSecurity] = useState({ current: "", newPassword: "", confirmPassword: "" });
  const [business, setBusiness] = useState({ name: "", type: "", cnpj: "", phone: "", address: "" });
  const [notifications, setNotifications] = useState({
    emailNewDelivery: false,
    emailStatusChanges: true,
    emailDelivered: true,
    emailPayment: false,
    smsNewDelivery: true,
    smsStatusChanges: true,
    smsDelivered: true,
  });
  const [payment, setPayment] = useState({ plan: "Plano Básico - R$ 49,90/mês", cards: [], newCard: { number: "", expiry: "", cvv: "", cardLast4: "" } });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notificationsList, setNotificationsList] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchProfile(token);
      fetchBusiness(token);
      fetchNotifications(token);
      fetchHistory(token);
      fetchPayment(token);

      socketRef.current = io('http://localhost:5000', { auth: { token } });
      socketRef.current.on('connect', () => {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        socketRef.current.emit('join', userId);
      });
      socketRef.current.on('notification', (data) => {
        setNotificationsList((prev) => [...prev, { ...data, id: Date.now(), timestamp: new Date().toLocaleTimeString() }]);
        alert(`${data.type.toUpperCase()}: ${data.message}`);
      });
      socketRef.current.on('historyUpdate', (data) => setHistory(data));

      return () => socketRef.current?.disconnect();
    } else {
      setError("Nenhum token de autenticação encontrado. Faça login novamente.");
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get("/api/settings/me", { headers: { Authorization: `Bearer ${token}` } });
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Acesso negado. Faça login novamente." : "Erro ao carregar perfil: " + err.message);
    }
  };

  const fetchBusiness = async (token) => {
    try {
      const response = await axios.get("/api/settings/business", { headers: { Authorization: `Bearer ${token}` } });
      setBusiness(response.data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Acesso negado. Faça login novamente." : "Erro ao carregar dados da loja: " + err.message);
    }
  };

  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get("/api/settings/notifications", { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(response.data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Acesso negado. Faça login novamente." : "Erro ao carregar notificações: " + err.message);
    }
  };

  const fetchHistory = async (token) => {
    try {
      const response = await axios.get("/api/settings/history", { headers: { Authorization: `Bearer ${token}` } });
      setHistory(response.data);
    } catch (err) {
      setError(err.response?.status === 403 ? "Acesso negado. Faça login novamente." : "Erro ao carregar histórico: " + err.message);
    }
  };

  const fetchPayment = async (token) => {
    try {
      const response = await axios.get("/api/settings/payment/cards", { headers: { Authorization: `Bearer ${token}` } });
      setPayment((prev) => ({ ...prev, cards: response.data }));
    } catch (err) {
      setError(err.response?.status === 403 ? "Acesso negado. Faça login novamente." : "Erro ao carregar pagamento: " + err.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (profile.cpf && !validateCPF(profile.cpf)) {
      setError("CPF inválido");
      return;
    }
    try {
      const response = await axios.put("/api/settings/me", profile, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setProfile(response.data.user);
      setSuccess("Perfil salvo com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao salvar perfil: " + err.message);
      setSuccess("");
    }
  };

  const saveSecurity = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (!security.current || !security.newPassword) {
      setError("Preencha todos os campos de senha");
      return;
    }
    try {
      await axios.put("/api/settings/security", security, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setSecurity({ current: "", newPassword: "", confirmPassword: "" });
      setSuccess("Senha atualizada com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao atualizar senha: " + err.message);
      setSuccess("");
    }
  };

  const saveBusiness = async (e) => {
    e.preventDefault();
    if (business.cnpj && !validateCNPJ(business.cnpj)) {
      setError("CNPJ inválido");
      return;
    }
    try {
      const response = await axios.put("/api/settings/business", business, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setBusiness(response.data.business);
      setSuccess("Dados da loja salvos com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao salvar dados da loja: " + err.message);
      setSuccess("");
    }
  };

  const saveNotifications = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/settings/notifications", notifications, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setSuccess("Preferências de notificação salvas com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao salvar notificações: " + err.message);
      setSuccess("");
    }
  };

  const savePayment = async (e) => {
    e.preventDefault();
    try {
      const newPlan = payment.plan === "Plano Básico - R$ 49,90/mês" ? "Plano Premium - R$ 99,90/mês" : "Plano Básico - R$ 49,90/mês";
      const response = await axios.put("/api/settings/payment", { plan: newPlan }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setPayment((prev) => ({ ...prev, plan: response.data.plan }));
      setSuccess("Plano atualizado com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao atualizar plano: " + err.message);
      setSuccess("");
    }
  };

  const addCard = async (e) => {
    e.preventDefault();
    const { number, expiry, cvv, cardLast4 } = payment.newCard;
    if (!number || !expiry || !cvv || !cardLast4) {
      setError("Preencha todos os campos do cartão");
      return;
    }
    const cleanedNumber = number.replace(/\D/g, '');
    if (!/^\d{16}$/.test(cleanedNumber)) {
      setError("O número do cartão deve ter exatamente 16 dígitos");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError("O CVV deve ter exatamente 3 dígitos");
      return;
    }
    if (!/^\d{4}$/.test(cardLast4)) {
      setError("Os últimos 4 dígitos devem ser exatamente 4 números");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("A validade deve estar no formato MM/AA (ex.: 12/25)");
      return;
    }

    try {
      const response = await axios.post("/api/settings/payment/cards", { number: cleanedNumber, expiry, cvv, cardLast4 }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setPayment((prev) => ({ ...prev, cards: response.data.cards, newCard: { number: "", expiry: "", cvv: "", cardLast4: "" } }));
      setSuccess("Cartão adicionado com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao adicionar cartão: " + err.message);
      setSuccess("");
    }
  };

  const removeCard = async (cardLast4) => {
    try {
      await axios.delete(`/api/settings/payment/cards/${cardLast4}`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      setPayment((prev) => ({ ...prev, cards: prev.cards.filter(c => c.cardLast4 !== cardLast4) }));
      setSuccess("Cartão removido com sucesso!");
      setError("");
    } catch (err) {
      setError("Erro ao remover cartão: " + err.message);
      setSuccess("");
    }
  };

  const handleSwitchChange = (key) => (checked) => {
    console.log(`Tentando mudar ${key} para:`, checked); // Log inicial
    setNotifications((prev) => {
      const newNotifications = { ...prev, [key]: checked };
      console.log(`Novo estado de notifications:`, { ...newNotifications }); // Expandir o objeto
      return newNotifications;
    });
  };

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.subtitle}>Gerencie suas preferências e dados da conta.</p>
      </div>
      <Tabs defaultValue="profile" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="business">Loja</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveProfile} className={styles.grid}>
                <div className={styles.formGroup}>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={profile.cpf} onChange={(e) => {
                    const value = e.target.value;
                    setProfile({ ...profile, cpf: value });
                    if (value && !validateCPF(value)) setError("CPF inválido");
                    else if (error === "CPF inválido") setError("");
                  }} />
                </div>
                <Button type="submit" className={styles.saveButton}>Salvar Alterações</Button>
              </form>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie sua senha e segurança da conta.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveSecurity} className={styles.grid}>
                <div className={styles.formGroup}>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" value={security.current} onChange={(e) => setSecurity({ ...security, current: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} />
                </div>
                <Button type="submit" className={styles.saveButton}>Atualizar Senha</Button>
              </form>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="business" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Atualize as informações do seu estabelecimento.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveBusiness} className={styles.grid}>
                <div className={styles.formGroup}>
                  <Label htmlFor="business-name">Nome da Loja</Label>
                  <Input id="business-name" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="business-type">Tipo de Comércio</Label>
                  <Input id="business-type" value={business.type} onChange={(e) => setBusiness({ ...business, type: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={business.cnpj} onChange={(e) => {
                    const value = e.target.value;
                    setBusiness({ ...business, cnpj: value });
                    if (value && !validateCNPJ(value)) setError("CNPJ inválido");
                    else if (error === "CNPJ inválido") setError("");
                  }} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="business-phone">Telefone Comercial</Label>
                  <Input id="business-phone" value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input id="address" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} />
                </div>
                <Button type="submit" className={styles.saveButton}>Salvar Alterações</Button>
              </form>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como e quando você deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveNotifications} className={styles.notificationSection}>
                <div className={styles.notificationGrid}>
                  <div>
                    <h4 className={styles.notificationTitle}>Notificações por Email</h4>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="email-new-delivery" className={styles.switchLabel}>Novas solicitações de entrega</Label>
                      <Switch id="email-new-delivery" checked={notifications.emailNewDelivery} onCheckedChange={handleSwitchChange("emailNewDelivery")} className={styles.switchCustom} />
                    </div>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="email-status-changes" className={styles.switchLabel}>Mudanças de status nas entregas</Label>
                      <Switch id="email-status-changes" checked={notifications.emailStatusChanges} onCheckedChange={handleSwitchChange("emailStatusChanges")} className={styles.switchCustom} />
                    </div>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="email-delivered" className={styles.switchLabel}>Confirmação de entrega realizada</Label>
                      <Switch id="email-delivered" checked={notifications.emailDelivered} onCheckedChange={handleSwitchChange("emailDelivered")} className={styles.switchCustom} />
                    </div>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="email-payment" className={styles.switchLabel}>Recibos e informações de pagamento</Label>
                      <Switch id="email-payment" checked={notifications.emailPayment} onCheckedChange={handleSwitchChange("emailPayment")} className={styles.switchCustom} />
                    </div>
                  </div>
                  <div>
                    <h4 className={styles.notificationTitle}>Notificações por SMS</h4>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="sms-new-delivery" className={styles.switchLabel}>Novas solicitações de entrega</Label>
                      <Switch id="sms-new-delivery" checked={notifications.smsNewDelivery} onCheckedChange={handleSwitchChange("smsNewDelivery")} className={styles.switchCustom} />
                    </div>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="sms-status-changes" className={styles.switchLabel}>Mudanças de status nas entregas</Label>
                      <Switch id="sms-status-changes" checked={notifications.smsStatusChanges} onCheckedChange={handleSwitchChange("smsStatusChanges")} className={styles.switchCustom} />
                    </div>
                    <div className={styles.switchGroup}>
                      <Label htmlFor="sms-delivered" className={styles.switchLabel}>Confirmação de entrega realizada</Label>
                      <Switch id="sms-delivered" checked={notifications.smsDelivered} onCheckedChange={handleSwitchChange("smsDelivered")} className={styles.switchCustom} />
                    </div>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Button type="submit" className={styles.saveButton}>Salvar Preferências</Button>
                </div>
              </form>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>Configure suas informações de pagamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.paymentSection}>
                <div className={styles.paymentItem}>
                  <div>
                    <h4 className={styles.paymentTitle}>Plano atual</h4>
                    <p className={styles.paymentDescription}>{payment.plan}</p>
                  </div>
                  <Button variant="outline" onClick={savePayment}>Alterar Plano</Button>
                </div>
                <Separator className={styles.separator} />
                <div className={styles.paymentItem}>
                  <div>
                    <h4 className={styles.paymentTitle}>Métodos de pagamento</h4>
                    {payment.cards.map((card) => (
                      <div key={card.cardLast4} className={styles.cardItem}>
                        <p className={styles.paymentDescription}>Cartão terminando em {card.cardLast4}</p>
                        <Button variant="outline" onClick={() => removeCard(card.cardLast4)}>Remover</Button>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={addCard} className={styles.cardForm}>
                    <div className={styles.formGroup}>
                      <Label htmlFor="card-number">Número do Cartão (16 dígitos)</Label>
                      <Input id="card-number" value={payment.newCard.number} onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, number: e.target.value } })} />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="card-expiry">Validade (MM/AA)</Label>
                      <Input id="card-expiry" value={payment.newCard.expiry} onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, expiry: e.target.value } })} />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="card-cvv">CVV (3 dígitos)</Label>
                      <Input id="card-cvv" value={payment.newCard.cvv} onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, cvv: e.target.value } })} />
                    </div>
                    <div className={styles.formGroup}>
                      <Label htmlFor="card-last4">Últimos 4 Dígitos</Label>
                      <Input id="card-last4" value={payment.newCard.cardLast4} onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, cardLast4: e.target.value } })} />
                    </div>
                    <Button type="submit" className={styles.saveButton}>Adicionar Cartão</Button>
                  </form>
                </div>
                <div className={styles.buttonGroup}>
                  <Button variant="outline" disabled>Ver Faturas</Button>
                </div>
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Histórico de Alterações</CardTitle>
              <CardDescription>Veja o registro das suas últimas alterações.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.historySection}>
                {history.length > 0 ? (
                  history.map((item) => (
                    <div key={item._id || `history-${item.action}-${item.date}`} className={styles.historyItem}>
                      <p><strong>{item.action}</strong> - {new Date(item.date).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noHistory}>Nenhum histórico disponível.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle>Notificações Recebidas</CardTitle>
              <CardDescription>Veja as últimas notificações recebidas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.historySection}>
                {notificationsList.length > 0 ? (
                  notificationsList.map((item) => (
                    <div key={item.id || `notification-${item.message}-${item.timestamp}`} className={styles.historyItem}>
                      <p><strong>{item.type.toUpperCase()}</strong>: {item.message} - {item.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noHistory}>Nenhuma notificação recebida.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;