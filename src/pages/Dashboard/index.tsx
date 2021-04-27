import React, { useState, useEffect, useCallback } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View, Image, Alert } from 'react-native';

import formatValue from '../../utils/formatValue';
import { useCart } from '../../hooks/cart';
import api from '../../services/api';

import FloatingCart from '../../components/FloatingCart';

import {
  Container,
  ProductContainer,
  ProductImage,
  ProductList,
  Product,
  ProductTitle,
  PriceContainer,
  ProductPrice,
  ProductButton,
} from './styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      try {
        const response = await api.get<Product[]>('/products');
        const newProducts: Product[] = response.data;
        setProducts(newProducts);
      } catch (e) {
        Alert.alert(
          'Erro no acesso ao servidor.',
          'Sua lista não pode ser carregada',
        );
        console.log(e);
      }
    }

    loadProducts();
  }, []);

  const handleAddToCart = useCallback(
    async (item: Product) => {
      // TODO
      try {
        await addToCart(item);
      } catch (e) {
        Alert.alert(
          'Erro no acesso ao servidor.',
          'Seu item não pode ser adicionado ao carrinho.',
        );
        console.log(e);
      }
    },
    [addToCart],
  );

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }) => (
            <Product>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitle>{item.title}</ProductTitle>
              <PriceContainer>
                <ProductPrice>{formatValue(item.price)}</ProductPrice>
                <ProductButton
                  testID={`add-to-cart-${item.id}`}
                  onPress={() => handleAddToCart(item)}
                >
                  <FeatherIcon size={20} name="plus" color="#C4C4C4" />
                </ProductButton>
              </PriceContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <FloatingCart />
    </Container>
  );
};

export default Dashboard;
