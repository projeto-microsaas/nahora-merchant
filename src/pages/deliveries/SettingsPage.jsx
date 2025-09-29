import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import { Checkbox } from "../../components/ui/checkbox";
import { User, Shield, Store, Bell, CreditCard, History, Save, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
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
          <TabsTrigger value="profile" className={styles.tabTrigger}>
            <User className={styles.tabIcon} />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className={styles.tabTrigger}>
            <Shield className={styles.tabIcon} />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="business" className={styles.tabTrigger}>
            <Store className={styles.tabIcon} />
            Loja
          </TabsTrigger>
          <TabsTrigger value="notifications" className={styles.tabTrigger}>
            <Bell className={styles.tabIcon} />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="payment" className={styles.tabTrigger}>
            <CreditCard className={styles.tabIcon} />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="history" className={styles.tabTrigger}>
            <History className={styles.tabIcon} />
            Histórico
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <User className={styles.titleIcon} />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize suas informações pessoais e dados de contato.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveProfile} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <Label htmlFor="name" className={styles.label}>Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={styles.input}
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="email" className={styles.label}>Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={styles.input}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="phone" className={styles.label}>Telefone</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone} 
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={styles.input}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="cpf" className={styles.label}>CPF</Label>
                    <Input 
                      id="cpf" 
                      value={profile.cpf} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setProfile({ ...profile, cpf: value });
                        if (value && !validateCPF(value)) setError("CPF inválido");
                        else if (error === "CPF inválido") setError("");
                      }}
                      className={styles.input}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" className={styles.saveButton}>
                    <Save className={styles.buttonIcon} />
                    Salvar Alterações
                  </Button>
                </div>
              </form>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Shield className={styles.titleIcon} />
                Segurança da Conta
              </CardTitle>
              <CardDescription>Gerencie sua senha e configurações de segurança.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveSecurity} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <Label htmlFor="current-password" className={styles.label}>Senha Atual</Label>
                    <div className={styles.passwordInput}>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={security.current} 
                        onChange={(e) => setSecurity({ ...security, current: e.target.value })}
                        className={styles.input}
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="new-password" className={styles.label}>Nova Senha</Label>
                    <div className={styles.passwordInput}>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={security.newPassword} 
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className={styles.input}
                        placeholder="Digite sua nova senha"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="confirm-password" className={styles.label}>Confirmar Nova Senha</Label>
                    <div className={styles.passwordInput}>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={security.confirmPassword} 
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className={styles.input}
                        placeholder="Confirme sua nova senha"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" className={styles.saveButton}>
                    <Shield className={styles.buttonIcon} />
                    Atualizar Senha
                  </Button>
                </div>
              </form>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="business" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Store className={styles.titleIcon} />
                Informações da Loja
              </CardTitle>
              <CardDescription>Atualize as informações do seu estabelecimento comercial.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveBusiness} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <Label htmlFor="business-name" className={styles.label}>Nome da Loja</Label>
                    <Input 
                      id="business-name" 
                      value={business.name} 
                      onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                      className={styles.input}
                      placeholder="Digite o nome do seu estabelecimento"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="business-type" className={styles.label}>Tipo de Comércio</Label>
                    <Input 
                      id="business-type" 
                      value={business.type} 
                      onChange={(e) => setBusiness({ ...business, type: e.target.value })}
                      className={styles.input}
                      placeholder="Ex: Restaurante, Loja, Farmácia..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="cnpj" className={styles.label}>CNPJ</Label>
                    <Input 
                      id="cnpj" 
                      value={business.cnpj} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setBusiness({ ...business, cnpj: value });
                        if (value && !validateCNPJ(value)) setError("CNPJ inválido");
                        else if (error === "CNPJ inválido") setError("");
                      }}
                      className={styles.input}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="business-phone" className={styles.label}>Telefone Comercial</Label>
                    <Input 
                      id="business-phone" 
                      value={business.phone} 
                      onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                      className={styles.input}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <Label htmlFor="address" className={styles.label}>Endereço Completo</Label>
                    <Input 
                      id="address" 
                      value={business.address} 
                      onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                      className={styles.input}
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" className={styles.saveButton}>
                    <Store className={styles.buttonIcon} />
                    Salvar Informações
                  </Button>
                </div>
              </form>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Bell className={styles.titleIcon} />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>Configure como e quando você deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <form onSubmit={saveNotifications} className={styles.form}>
                <div className={styles.notificationGrid}>
                  {/* Notificações por Email */}
                  <div className={styles.notificationSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionIcon}>📧</div>
                      <h4 className={styles.sectionTitle}>Notificações por Email</h4>
                    </div>
                    <div className={styles.notificationOptions}>
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="email-new-delivery" className={styles.optionLabel}>
                            Novas solicitações de entrega
                          </Label>
                          <p className={styles.optionDescription}>Receba um email quando uma nova entrega for solicitada</p>
                        </div>
                        <Switch 
                          id="email-new-delivery" 
                          checked={notifications.emailNewDelivery} 
                          onCheckedChange={handleSwitchChange("emailNewDelivery")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                      
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="email-status-changes" className={styles.optionLabel}>
                            Mudanças de status nas entregas
                          </Label>
                          <p className={styles.optionDescription}>Seja notificado sobre atualizações no status das entregas</p>
                        </div>
                        <Switch 
                          id="email-status-changes" 
                          checked={notifications.emailStatusChanges} 
                          onCheckedChange={handleSwitchChange("emailStatusChanges")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                      
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="email-delivered" className={styles.optionLabel}>
                            Confirmação de entrega realizada
                          </Label>
                          <p className={styles.optionDescription}>Receba confirmação quando uma entrega for concluída</p>
                        </div>
                        <Switch 
                          id="email-delivered" 
                          checked={notifications.emailDelivered} 
                          onCheckedChange={handleSwitchChange("emailDelivered")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                      
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="email-payment" className={styles.optionLabel}>
                            Recibos e informações de pagamento
                          </Label>
                          <p className={styles.optionDescription}>Receba comprovantes e informações sobre pagamentos</p>
                        </div>
                        <Switch 
                          id="email-payment" 
                          checked={notifications.emailPayment} 
                          onCheckedChange={handleSwitchChange("emailPayment")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notificações por SMS */}
                  <div className={styles.notificationSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionIcon}>📱</div>
                      <h4 className={styles.sectionTitle}>Notificações por SMS</h4>
                    </div>
                    <div className={styles.notificationOptions}>
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="sms-new-delivery" className={styles.optionLabel}>
                            Novas solicitações de entrega
                          </Label>
                          <p className={styles.optionDescription}>Receba SMS quando uma nova entrega for solicitada</p>
                        </div>
                        <Switch 
                          id="sms-new-delivery" 
                          checked={notifications.smsNewDelivery} 
                          onCheckedChange={handleSwitchChange("smsNewDelivery")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                      
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="sms-status-changes" className={styles.optionLabel}>
                            Mudanças de status nas entregas
                          </Label>
                          <p className={styles.optionDescription}>Seja notificado via SMS sobre atualizações importantes</p>
                        </div>
                        <Switch 
                          id="sms-status-changes" 
                          checked={notifications.smsStatusChanges} 
                          onCheckedChange={handleSwitchChange("smsStatusChanges")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                      
                      <div className={styles.notificationOption}>
                        <div className={styles.optionInfo}>
                          <Label htmlFor="sms-delivered" className={styles.optionLabel}>
                            Confirmação de entrega realizada
                          </Label>
                          <p className={styles.optionDescription}>Receba SMS de confirmação quando uma entrega for concluída</p>
                        </div>
                        <Switch 
                          id="sms-delivered" 
                          checked={notifications.smsDelivered} 
                          onCheckedChange={handleSwitchChange("smsDelivered")} 
                          className={styles.notificationSwitch}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <Button type="submit" className={styles.saveButton}>
                    <Bell className={styles.buttonIcon} />
                    Salvar Preferências
                  </Button>
                </div>
              </form>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <CreditCard className={styles.titleIcon} />
                Configurações de Pagamento
              </CardTitle>
              <CardDescription>Gerencie seus métodos de pagamento e planos de assinatura.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.paymentSection}>
                {/* Plano Atual */}
                <div className={styles.paymentCard}>
                  <div className={styles.paymentCardHeader}>
                    <div className={styles.paymentIcon}>💳</div>
                    <div className={styles.paymentInfo}>
                      <h4 className={styles.paymentTitle}>Plano Atual</h4>
                      <p className={styles.paymentDescription}>{payment.plan}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={savePayment}
                    className={styles.paymentButton}
                  >
                    Alterar Plano
                  </Button>
                </div>

                {/* Métodos de Pagamento */}
                <div className={styles.paymentCard}>
                  <div className={styles.paymentCardHeader}>
                    <div className={styles.paymentIcon}>💳</div>
                    <div className={styles.paymentInfo}>
                      <h4 className={styles.paymentTitle}>Métodos de Pagamento</h4>
                      <p className={styles.paymentDescription}>Gerencie seus cartões cadastrados</p>
                    </div>
                  </div>
                  
                  {/* Cartões existentes */}
                  {payment.cards.length > 0 && (
                    <div className={styles.cardsList}>
                      {payment.cards.map((card) => (
                        <div key={card.cardLast4} className={styles.cardItem}>
                          <div className={styles.cardInfo}>
                            <div className={styles.cardIcon}>💳</div>
                            <span className={styles.cardText}>Cartão terminando em {card.cardLast4}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeCard(card.cardLast4)}
                            className={styles.removeButton}
                          >
                            <Trash2 className={styles.buttonIcon} />
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário para adicionar cartão */}
                  <form onSubmit={addCard} className={styles.form}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <Label htmlFor="card-number" className={styles.label}>Número do Cartão</Label>
                        <Input 
                          id="card-number" 
                          value={payment.newCard.number} 
                          onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, number: e.target.value } })}
                          className={styles.input}
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <Label htmlFor="card-expiry" className={styles.label}>Validade</Label>
                        <Input 
                          id="card-expiry" 
                          value={payment.newCard.expiry} 
                          onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, expiry: e.target.value } })}
                          className={styles.input}
                          placeholder="MM/AA"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <Label htmlFor="card-cvv" className={styles.label}>CVV</Label>
                        <Input 
                          id="card-cvv" 
                          value={payment.newCard.cvv} 
                          onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, cvv: e.target.value } })}
                          className={styles.input}
                          placeholder="000"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <Label htmlFor="card-last4" className={styles.label}>Últimos 4 Dígitos</Label>
                        <Input 
                          id="card-last4" 
                          value={payment.newCard.cardLast4} 
                          onChange={(e) => setPayment({ ...payment, newCard: { ...payment.newCard, cardLast4: e.target.value } })}
                          className={styles.input}
                          placeholder="0000"
                        />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <Button type="submit" className={styles.saveButton}>
                        <Plus className={styles.buttonIcon} />
                        Adicionar Cartão
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Ações adicionais */}
                <div className={styles.paymentActions}>
                  <Button variant="outline" disabled className={styles.actionButton}>
                    <CreditCard className={styles.buttonIcon} />
                    Ver Faturas
                  </Button>
                </div>
              </div>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className={styles.tabContent}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <History className={styles.titleIcon} />
                Histórico de Alterações
              </CardTitle>
              <CardDescription>Veja o registro das suas últimas alterações no sistema.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.historySection}>
                {history.length > 0 ? (
                  <div className={styles.historyList}>
                    {history.map((item) => (
                      <div key={item._id || `history-${item.action}-${item.date}`} className={styles.historyItem}>
                        <div className={styles.historyIcon}>📝</div>
                        <div className={styles.historyContent}>
                          <p className={styles.historyAction}>{item.action}</p>
                          <p className={styles.historyDate}>{new Date(item.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <p className={styles.emptyMessage}>Nenhum histórico disponível.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Bell className={styles.titleIcon} />
                Notificações Recebidas
              </CardTitle>
              <CardDescription>Veja as últimas notificações recebidas no sistema.</CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.historySection}>
                {notificationsList.length > 0 ? (
                  <div className={styles.historyList}>
                    {notificationsList.map((item) => (
                      <div key={item.id || `notification-${item.message}-${item.timestamp}`} className={styles.historyItem}>
                        <div className={styles.historyIcon}>🔔</div>
                        <div className={styles.historyContent}>
                          <p className={styles.historyAction}>
                            <span className={styles.notificationType}>{item.type.toUpperCase()}</span>: {item.message}
                          </p>
                          <p className={styles.historyDate}>{item.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔕</div>
                    <p className={styles.emptyMessage}>Nenhuma notificação recebida.</p>
                  </div>
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