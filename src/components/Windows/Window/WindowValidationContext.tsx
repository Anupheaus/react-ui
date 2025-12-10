import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { createComponent } from '../../Component';
import { useBound } from '../../../hooks';

interface WindowValidationContextProps {
  checkIsValid(): boolean;
}

const WindowValidationContext = createContext<WindowValidationContextProps>({
  checkIsValid: () => false,
});

interface Props {
  onCheckIsValid(): boolean;
  children: ReactNode;
}

export const WindowValidationProvider = createComponent('WindowValidationProvider', ({
  onCheckIsValid,
  children,
}: Props) => {

  const checkIsValid = useBound(() => onCheckIsValid());

  const context = useMemo<WindowValidationContextProps>(() => ({
    checkIsValid,
  }), []);

  return (
    <WindowValidationContext.Provider value={context}>
      {children}
    </WindowValidationContext.Provider>
  );
});

export function useWindowValidation() {
  const { checkIsValid } = useContext(WindowValidationContext);

  return {
    isValid: checkIsValid,
  };
}
