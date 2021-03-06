import React, { useCallback, useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { Alert, View } from 'react-native';

import { useCart } from '../../hooks/cart';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import formatValue from '../../utils/formatValue';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { increment, decrement, products } = useCart();

  const handleIncrement = useCallback(
    async (id: string) => {
      // TODO
      try {
        await increment(id);
      } catch (e) {
        Alert.alert(
          'Erro no acesso ao servidor.',
          'Seu item não pode ser adicionado ao carrinho.',
        );
        console.log(e);
      }
    },
    [increment],
  );

  const handleDecrement = useCallback(
    async (id: string) => {
      // TODO
      try {
        await decrement(id);
      } catch (e) {
        Alert.alert(
          'Erro no acesso ao servidor.',
          'Seu item não pode ser adicionado ao carrinho.',
        );
        console.log(e);
      }
    },
    [decrement],
  );

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
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => (
            <Product>
              <ProductImage source={{ uri: item.image_url }} />
              <ProductTitleContainer>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductPriceContainer>
                  <ProductSinglePrice>
                    {formatValue(item.price)}
                  </ProductSinglePrice>

                  <TotalContainer>
                    <ProductQuantity>{`${item.quantity}x`}</ProductQuantity>

                    <ProductPrice>
                      {formatValue(item.price * item.quantity)}
                    </ProductPrice>
                  </TotalContainer>
                </ProductPriceContainer>
              </ProductTitleContainer>
              <ActionContainer>
                <ActionButton
                  testID={`increment-${item.id}`}
                  onPress={() => handleIncrement(item.id)}
                >
                  <FeatherIcon name="plus" color="#E83F5B" size={16} />
                </ActionButton>
                <ActionButton
                  testID={`decrement-${item.id}`}
                  onPress={() => handleDecrement(item.id)}
                >
                  <FeatherIcon name="minus" color="#E83F5B" size={16} />
                </ActionButton>
              </ActionContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
