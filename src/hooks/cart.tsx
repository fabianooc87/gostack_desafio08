import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const tempProducts = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      const storagedProducts: Product[] = JSON.parse(tempProducts || '[]');
      setProducts(storagedProducts);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const produtoCadastrado = products.find(p => p.id === product.id);
      let newStoragedProducts: Product[];
      if (produtoCadastrado) {
        newStoragedProducts = products.map(p => {
          let { quantity } = p;
          if (p.id === product.id) {
            quantity += 1;
          }
          return {
            ...p,
            quantity,
          };
        });
      } else {
        const { id, title, image_url, price } = product;
        newStoragedProducts = [
          ...products,
          { id, title, image_url, price, quantity: 1 },
        ];
      }

      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newStoragedProducts),
      );
      setProducts(newStoragedProducts);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const newStoragedProducts: Product[] = products.map(p => {
        const { title, image_url, price } = p;
        return p.id === id
          ? { id, title, image_url, price, quantity: p.quantity + 1 }
          : p;
      });
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newStoragedProducts),
      );
      console.log('esses são os produtos: ', newStoragedProducts);
      setProducts(newStoragedProducts);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newStoragedProducts: Product[] = products
        .map(p => {
          const { title, image_url, price } = p;
          return p.id === id
            ? { id, title, image_url, price, quantity: p.quantity - 1 }
            : p;
        })
        .filter(p => p.quantity > 0);
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(newStoragedProducts),
      );
      setProducts(newStoragedProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
