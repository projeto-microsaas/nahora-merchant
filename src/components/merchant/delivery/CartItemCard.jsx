import React from 'react';  
import { useFormContext } from 'react-hook-form';
import styles from './CartItemCard.module.css';

const CartItemCard = ({ product, index }) => {
  const { setValue, watch } = useFormContext();
  const selectedProducts = watch('order.products') || [];

  const handleQuantityChange = (newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], quantity: newQuantity };
    setValue('order.products', updatedProducts, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemove = () => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setValue('order.products', updatedProducts, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{product.name}</p>
        <p className={styles.itemPrice}>R${(product.price * product.quantity).toFixed(2)}</p>
      </div>
      <div className={styles.quantityControl}>
        <button
          type="button"
          onClick={() => handleQuantityChange(Math.max(1, product.quantity - 1))}
          className={styles.quantityButton}
        >
          -
        </button>
        <span className={styles.quantity}>{product.quantity}</span>
        <button
          type="button"
          onClick={() => handleQuantityChange(product.quantity + 1)}
          className={styles.quantityButton}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className={styles.removeButton}
      >
        Remover
      </button>
    </div>
  );
};

export default CartItemCard;
