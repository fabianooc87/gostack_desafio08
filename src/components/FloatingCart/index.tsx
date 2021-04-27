import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    console.log(products);
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const { price } = products.reduce(
      (acumulator, product) => {
        const p = acumulator.price + product.quantity * product.price;
        return { price: p };
      },
      {
        price: 0,
      },
    );
    console.log(price);
    return formatValue(price);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    // TODO RETURN THE SUM OF THE QUANTITY OF THE PRODUCTS IN THE CART
    const { quantity } = products.reduce(
      (acumulator, product) => {
        const q = acumulator.quantity + product.quantity;
        return { quantity: q };
      },
      {
        quantity: 0,
      },
    );
    console.log(quantity);
    return quantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
