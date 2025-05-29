import React from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    cnpj: "",
    businessPhone: "",
    address: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNewDelivery: false,
    emailStatusChanges: false,
    emailDelivered: false,
    emailPayment: false,
    smsNewDelivery: false,
    smsStatusChanges: false,
    smsDelivered: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get("https://api.example.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: "",
          cpf: "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "https://api.example.com/api/users/user",
        { name: profileData.name, email: profileData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar perfil: " + error.message);
    }
  };

  const handleBusinessSave = () => {
    // Implementar salvamento de dados da loja (endpoint futuro)
    alert("Salvamento de dados da loja não implementado ainda.");
  };

  const handleNotificationSave = () => {
    // Implementar salvamento de notificações (endpoint futuro)
    alert("Salvamento de preferências de notificação não implementado ainda.");
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e dados da conta.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="business">Loja</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={profileData.cpf} onChange={(e) => setProfileData({ ...profileData, cpf: e.target.value })} />
                </div>
              </div>
              <Button className="mt-4 bg-javai-purple hover:bg-javai-purple-dark" onClick={handleProfileSave}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie sua senha e segurança da conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Button className="mt-4 bg-javai-purple hover:bg-javai-purple-dark">
                Atualizar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Atualize as informações do seu estabelecimento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nome da Loja</Label>
                  <Input
                    id="business-name"
                    value={businessData.businessName}
                    onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-type">Tipo de Comércio</Label>
                  <Input
                    id="business-type"
                    value={businessData.businessType}
                    onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={businessData.cnpj}
                    onChange={(e) => setBusinessData({ ...businessData, cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Telefone Comercial</Label>
                  <Input
                    id="business-phone"
                    value={businessData.businessPhone}
                    onChange={(e) => setBusinessData({ ...businessData, businessPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  value={businessData.address}
                  onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                />
              </div>

              <Button className="mt-4 bg-javai-purple hover:bg-javai-purple-dark" onClick={handleBusinessSave}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>Configure suas informações de pagamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Plano atual</h4>
                    <p className="text-sm text-muted-foreground">Plano Básico - R$ 49,90/mês</p>
                  </div>
                  <Button variant="outline">Alterar Plano</Button>
                </div>

                <Separator />

                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Método de pagamento</h4>
                  <p className="text-sm text-muted-foreground">Cartão de crédito terminando em 4242</p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline">Atualizar Cartão</Button>
                  <Button variant="outline">Ver Faturas</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como e quando você deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações por Email</h4>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="email-new-delivery" className="flex-1">Novas solicitações de entrega</Label>
                  <Switch
                    id="email-new-delivery"
                    checked={notificationSettings.emailNewDelivery}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNewDelivery: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="email-status-changes" className="flex-1">Mudanças de status nas entregas</Label>
                  <Switch
                    id="email-status-changes"
                    checked={notificationSettings.emailStatusChanges}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailStatusChanges: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="email-delivered" className="flex-1">Confirmação de entrega realizada</Label>
                  <Switch
                    id="email-delivered"
                    checked={notificationSettings.emailDelivered}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailDelivered: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="email-payment" className="flex-1">Recibos e informações de pagamento</Label>
                  <Switch
                    id="email-payment"
                    checked={notificationSettings.emailPayment}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailPayment: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notificações por SMS</h4>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="sms-new-delivery" className="flex-1">Novas solicitações de entrega</Label>
                  <Switch
                    id="sms-new-delivery"
                    checked={notificationSettings.smsNewDelivery}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNewDelivery: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="sms-status-changes" className="flex-1">Mudanças de status nas entregas</Label>
                  <Switch
                    id="sms-status-changes"
                    checked={notificationSettings.smsStatusChanges}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsStatusChanges: checked })}
                  />
                </div>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor="sms-delivered" className="flex-1">Confirmação de entrega realizada</Label>
                  <Switch
                    id="sms-delivered"
                    checked={notificationSettings.smsDelivered}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsDelivered: checked })}
                  />
                </div>
              </div>

              <Button className="mt-4 bg-javai-purple hover:bg-javai-purple-dark" onClick={handleNotificationSave}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;