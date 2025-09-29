import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PricingTable from '@/components/delivery/PricingTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calculator, TrendingUp, Users } from 'lucide-react';

const PricingPage = () => {
  return (
    <DashboardLayout>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabela de Preços</h1>
          <p className="text-gray-600">Transparência total nos valores do Já Vai!</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8">
          {/* Introdução */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  💰 Sistema de Precificação Transparente
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  Nossa precificação é baseada em <strong>distância</strong>, <strong>tipo de pacote</strong> e <strong>serviços especiais</strong>. 
                  Sem surpresas, sem taxas ocultas!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">R$ 6,00</div>
                    <div className="text-sm text-gray-600">Taxa base (até 2km)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">R$ 1,50</div>
                    <div className="text-sm text-gray-600">Por km adicional</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">20%</div>
                    <div className="text-sm text-gray-600">Taxa da plataforma</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Preços */}
          <PricingTable />

          {/* Exemplos Práticos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Exemplos Práticos de Cálculo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exemplo 1 */}
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-3">📦 Entrega Simples</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Distância:</span>
                      <span>3km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pacote:</span>
                      <span>Médio (até 5kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa base:</span>
                      <span>R$ 6,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1km extra:</span>
                      <span>R$ 1,50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador pacote:</span>
                      <span>+5%</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>R$ 7,88</span>
                    </div>
                  </div>
                </div>

                {/* Exemplo 2 */}
                <div className="p-4 border rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-800 mb-3">⚠️ Entrega Especial</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Distância:</span>
                      <span>8km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pacote:</span>
                      <span>Especial (frágil)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa base:</span>
                      <span>R$ 6,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>6km extras:</span>
                      <span>R$ 9,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa frágil:</span>
                      <span>R$ 2,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador:</span>
                      <span>+15%</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>R$ 19,55</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="font-semibold mb-2">Transparente</h3>
                <p className="text-gray-600 text-sm">
                  Você vê exatamente quanto vai pagar antes de confirmar a entrega
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold mb-2">Justo</h3>
                <p className="text-gray-600 text-sm">
                  Paga apenas pelo que usa: distância, tamanho e serviços especiais
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="font-semibold mb-2">Escalável</h3>
                <p className="text-gray-600 text-sm">
                  Preços que crescem com seu negócio, sem surpresas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>❓ Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Como é calculada a distância?</h4>
                  <p className="text-gray-600 text-sm">
                    Usamos a distância real entre os endereços de coleta e entrega, 
                    calculada por sistemas de mapas precisos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">O que acontece se o motoboy não aceitar?</h4>
                  <p className="text-gray-600 text-sm">
                    Você não paga nada! Só cobramos quando a entrega é aceita e realizada.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Posso cancelar após solicitar?</h4>
                  <p className="text-gray-600 text-sm">
                    Sim, mas pode haver taxa de cancelamento se o motoboy já estiver a caminho.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Como funciona o horário de pico?</h4>
                  <p className="text-gray-600 text-sm">
                    Entre 18h e 20h há um acréscimo de 10% devido à maior demanda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;
