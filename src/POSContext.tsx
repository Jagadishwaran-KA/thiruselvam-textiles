import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface POSContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  dailySales: number;
  setDailySales: React.Dispatch<React.SetStateAction<number>>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const usePOSContext = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOSContext must be used within a POSProvider");
  }
  return context;
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [dailySales, setDailySales] = useState(() => {
    const savedSales = localStorage.getItem("dailySales");
    return savedSales ? parseFloat(savedSales) : 0;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("dailySales", dailySales.toString());
  }, [dailySales]);

  return (
    <POSContext.Provider value={{ cart, setCart, dailySales, setDailySales }}>
      {children}
    </POSContext.Provider>
  );
};
