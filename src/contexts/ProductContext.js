import React, {createContext, useState, useEffect} from 'react';
// create context
export const ProductContext = createContext();

const ProductProvider = ({children}) => {
  // products state
  const [products, setProducts] = useState([]);
  // fetch products
  useEffect(()=> {
    const fetchProduts = async ()=> {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    }
    fetchProduts()
  }, [])
  return <ProductContext.Provider value={{products}}>{children}</ProductContext.Provider>;
};

export default ProductProvider;
