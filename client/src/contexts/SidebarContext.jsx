import React, { useState, createContext } from 'react';
export const SidebarContext = createContext({
  isOpen: false,
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (/** @type {boolean} */ value) => {},
  handleClose: () => {}
});

const SidebarProvider = ({ children }) => {
  // sidebar state
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  }

  return (<SidebarContext.Provider value={{ isOpen, setIsOpen, handleClose }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
