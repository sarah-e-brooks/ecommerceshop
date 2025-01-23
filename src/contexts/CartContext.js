// import React, { createContext, useState, useEffect, Children } from 'react';
// import { use } from 'react';
// import { IoIosColorPalette } from 'react-icons/io';

// // create context
// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   // cart state
//   const [cart, setCart] = useState([]);

//   // item amount state
//   const [itemAmount, setItemAmount] = useState(0);

//   // total price state
//   const [total, setTotal] = useState(0);



// // Load cart from server
// useEffect(() => {
//   const loadCart = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/cart');
//       const data = await response.json();
//       setCart(data);
//     } catch (error) {
//       console.error('Failed to load cart:', error);
//     }
//   };
//   loadCart();
// }, []);

// // Save cart to server whenever it changes
// useEffect(() => {
//   const saveCart = async () => {
//     try {
//       await fetch('http://localhost:5001/api/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ cart }),
//       });
//     } catch (error) {
//       console.error('Failed to save cart:', error);
//     }
//   };

//   if (cart.length > 0) saveCart();
// }, [cart]);




//   useEffect(() => {
//     const total = cart.reduce((accumulator, currentItem) => {
//       return accumulator + currentItem.price * currentItem.amount;
//     }, 0);
//     setTotal(total);
//   }, [cart]);

//   // update item amount
//   useEffect(() => {
//     if (cart) {
//       const amount = cart.reduce((accumulator, currentItem) => {
//         return accumulator + currentItem.amount;
//       }, 0);
//       setItemAmount(amount)
//     }
//   }, [cart]);

//   // add to cart
//   const addToCart = (product, id) => {
//     const newItem = { ...product, amount: 1 };
//     // check if the item is already in the cart
//     const cartItem = cart.find((item) => item.id === id);
//     // if cart item is already in the cart
//     if (cartItem) {
//       const newCart = [...cart].map((item) => {
//         if (item.id === id) {
//           return { ...item, amount: cartItem.amount + 1 };
//         }
//         return item;
//       });
//       setCart(newCart);
//     } else {
//       setCart([...cart, newItem]);
//     }
//   };

//   // remove from cart
//   const removeFromCart = (id) => {
//     const newCart = cart.filter(item => {
//       return item.id !== id;
//     });
//     setCart(newCart);
//   };

//   // clear cart
//   const clearCart = () => {
//     setCart([]);
//   };

//   // increase amount
//   const increaseAmount = (id) => {
//     const cartItem = cart.map((item) => {
//       if (item.id === id) {
//         return { ...item, amount: item.amount + 1 };
//       }
//       return item;
//     });
//     setCart(cartItem, id);
//   };

//   // decrease amount
//   const decreaseAmount = (id) => {
//     const cartItem = cart.find((item) => {
//       return item.id === id;
//     });
//     if (cartItem) {
//       const newCart = cart.map((item) => {
//         if (item.id === id) {
//           return { ...item, amount: cartItem.amount - 1 };
//         } else {
//           return item;
//         }
//       });
//       setCart(newCart);
//     } 
//     if (cartItem.amount < 2) {
//       removeFromCart(id);
//     }
//   };

//   return (
//     <CartContext.Provider 
//       value={{ 
//         cart, 
//         addToCart, 
//         removeFromCart, 
//         clearCart, 
//         increaseAmount, 
//         decreaseAmount, 
//         itemAmount,
//         total,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart from server
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart');
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart to server whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart }),
        });
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };

    if (cart.length > 0) saveCart();
  }, [cart]);

  // Update total and item amount
  useEffect(() => {
    const total = cart.reduce((acc, currentItem) => acc + currentItem.price * currentItem.amount, 0);
    setTotal(total);

    const amount = cart.reduce((acc, currentItem) => acc + currentItem.amount, 0);
    setItemAmount(amount);
  }, [cart]);

  const addToCart = (product, id) => {
    const newItem = { ...product, amount: 1 };
    const cartItem = cart.find((item) => item.id === id);

    if (cartItem) {
      const newCart = cart.map((item) =>
        item.id === id ? { ...item, amount: cartItem.amount + 1 } : item
      );
      setCart(newCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseAmount = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    );
    setCart(newCart);
  };

  const decreaseAmount = (id) => {
    const cartItem = cart.find((item) => item.id === id);

    if (cartItem) {
      const newCart = cart.map((item) =>
        item.id === id
          ? { ...item, amount: cartItem.amount - 1 }
          : item
      );
      setCart(newCart);

      if (cartItem.amount === 1) {
        removeFromCart(id);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
