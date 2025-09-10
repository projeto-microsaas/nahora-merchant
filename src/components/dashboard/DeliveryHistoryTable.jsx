import React from "react";
import { Link } from "react-router-dom";
import styles from "../../pages/deliveries/History.module.css";

const DeliveryHistoryTable = ({ deliveries }) => {
  if (!deliveries || deliveries.length === 0) {
    return <div className={styles.loading}>Nenhuma entrega encontrada.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.deliveryHistoryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Endereço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery, index) => (
            <tr
              key={delivery._id}
              className={`${styles.tableRow} ${
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              }`}
            >
              <td>{delivery._id}</td>
              <td>{delivery.customer || delivery.client || "—"}</td>
              <td>{delivery.address || "—"}</td>
              <td>
                <span
                  className={`${styles.status} ${styles[delivery.status.toLowerCase()]}`}
                >
                  {delivery.status}
                </span>
              </td>
              <td>
                <Link
                  to={`/delivery-status/${delivery._id}`}
                  className={styles.trackLink}
                >
                  Rastrear
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryHistoryTable;
