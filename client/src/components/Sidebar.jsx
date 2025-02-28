import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowForward } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import CartItem from './CartItem';
import { SidebarContext } from '../contexts/SidebarContext';
import { CartContext } from '../contexts/CartContext';

const Sidebar = () => {
  const { isOpen, handleClose } = useContext(SidebarContext);
  const { cart, clearCart, total, itemAmount } = useContext(CartContext);

  return (
    <div 
      className={`${
        isOpen ? 'right-0': '-right-full' 
      } w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] xl:max-w-[30vw] transition-all duration-300 z-20 flex flex-col`}
    >
      {/* header */}
      <div className='flex items-center justify-between py-6 border-b'>
        <div className='uppercase text-sm front-semibold'>
          Shopping Bag ({itemAmount})
        </div>

        {/* close icon */}
        <div 
          onClick={handleClose}
          className='cursor-pointer w-8 h-8 flex justify-center items-center'
        >
          <IoMdArrowForward className='text-2xl'/>
        </div>
      </div>

      {/* cart items */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>
        {cart.map((item) => {
          return <CartItem item={item} key={item.id} />;
        })}
      </div>

      {/* footer section */}
      <div className='flex flex-col gap-y-3 py-4 mt-4'>
        <div className='flex justify-between items-center px-4'>
          {/* total */}
          <div className='uppercase font-semibold'>
            <span className='mr-2'>Total:</span>$ {parseFloat(total).toFixed(2)}
          </div>
          {/* clear cart */}
          <div 
            onClick={clearCart} 
            className='cursor-pointer py-4 bg-red-500 text-white w-12 h-12 flex justify-center items-center text-xl'>
            <FiTrash2 />
          </div>
        </div>

        {/* view cart and checkout */}
        <div className='flex flex-col gap-y-3 px-4 mt-4'>
          <Link
            to='/'
            className='bg-gray-200 flex p-4 justify-center items-center text-primary w-full font-medium'
          >
            View Cart
          </Link>
          <Link
            to='/'
            className='bg-primary flex p-4 justify-center items-center text-white w-full font-medium'
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
