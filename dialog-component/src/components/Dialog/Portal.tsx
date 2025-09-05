import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    document.body.classList.add('dialog-open');
    
    return () => {
      document.body.classList.remove('dialog-open');
    };
  }, []);

  return mounted
    ? createPortal(children, document.body)
    : null;
};

export default Portal;