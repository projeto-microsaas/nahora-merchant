import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import styles from './PricingSimulationPage.module.css';

const PricingSimulationPage = () => {
  // Dados de simulação hardcoded para teste
  const simulation = [
    { distance: '1 km', category: 'Pequeno', totalPrice: 9.50, platformFee: 1.43, driverEarnings: 8.07 },
    { distance: '1 km', category: 'Médio', totalPrice: 14.25, platformFee: 2.14, driverEarnings: 12.11 },
    { distance: '1 km', category: 'Grande', totalPrice: 19.00, platformFee: 2.85, driverEarnings: 16.15 },
    { distance: '3 km', category: 'Pequeno', totalPrice: 12.50, platformFee: 1.88, driverEarnings: 10.62 },
    { distance: '3 km', category: 'Médio', totalPrice: 18.75, platformFee: 2.81, driverEarnings: 15.94 },
    { distance: '5 km', category: 'Grande', totalPrice: 28.00, platformFee: 4.20, driverEarnings: 23.80 }
  ];

  const formatPrice = (price) => `R$ ${price.toFixed(2).replace('.', ',')}`;

  return (
    <DashboardLayout>
      <h1 className={styles.pageTitle}>
        Simulação de Preços - NaHora! Marketplace
      </h1>
      
      <p className={styles.pageDescription}>
        Demonstração do novo modelo de precificação com taxa de 15% para a plataforma
      </p>

      {/* Tabela de Simulação */}
      <div className={styles.simulationTable}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>
            Simulação de Preços por Distância e Categoria
          </h2>
          <p className={styles.tableDescription}>
            Valores calculados com base no novo modelo de precificação
          </p>
        </div>
        <div className={styles.tableContent}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderCell}>Distância</th>
                <th className={styles.tableHeaderCell}>Categoria</th>
                <th className={styles.tableHeaderCell}>Preço Total</th>
                <th className={styles.tableHeaderCell}>Taxa App (15%)</th>
                <th className={styles.tableHeaderCell}>Entregador (85%)</th>
              </tr>
            </thead>
            <tbody>
              {simulation.map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{item.distance}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.categoryBadge} ${
                      item.category === 'Pequeno' ? styles.categorySmall :
                      item.category === 'Médio' ? styles.categoryMedium : styles.categoryLarge
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={`${styles.tableCell} ${styles.priceTotal}`}>
                    {formatPrice(item.totalPrice)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.pricePlatform}`}>
                    {formatPrice(item.platformFee)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.priceDriver}`}>
                    {formatPrice(item.driverEarnings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicação do Modelo */}
      <div className={styles.explanationSection}>
        <div className={styles.explanationHeader}>
          <h2 className={styles.explanationTitle}>Como Funciona o Novo Modelo</h2>
        </div>
        <div className={styles.explanationContent}>
          <div className={styles.formulaBox}>
            <h4 className={styles.formulaTitle}>Fórmula de Cálculo:</h4>
            <p className={styles.formulaText}>
              <strong>Preço Total</strong> = (Tarifa Base + (Distância × R$ 1,50)) × Multiplicador Categoria<br/>
              <strong>Taxa App</strong> = Preço Total × 15%<br/>
              <strong>Entregador</strong> = Preço Total × 85%
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingSimulationPage;
