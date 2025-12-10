import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { createComponent } from '../../Component';
import { FormObserverContext, type FormObserverContextProps } from './FormObserverContext';
import { useBound } from '../../../hooks';

interface Props {
  children: ReactNode;
}

export function useFormObserver() {
  const isDirtyRef = useRef<string[]>([]);

  const getIsDirty = useBound(() => isDirtyRef.current.length > 0);
  const setIsDirty = useBound((id: string, isDirty: boolean) => {
    if (isDirty) {
      if (!isDirtyRef.current.includes(id)) isDirtyRef.current.push(id);
    } else {
      const index = isDirtyRef.current.indexOf(id);
      if (index !== -1) isDirtyRef.current.splice(index, 1);
    }
  });

  const FormObserver = useMemo(() => createComponent('FormObserver', ({
    children,
  }: Props) => {

    const context = useMemo<FormObserverContextProps>(() => ({
      isReal: true,
      setIsDirty,
      getIsDirty,
    }), []);

    return (
      <FormObserverContext.Provider value={context}>
        {children}
      </FormObserverContext.Provider>
    );
  }), []);


  return {
    FormObserver,
    getIsDirty,
  };
}