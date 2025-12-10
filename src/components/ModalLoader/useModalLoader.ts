import type { ReactNode } from 'react';
import { useContext } from 'react';
import { ModalLoaderContext } from './ModalLoaderContext';
import { useBound, useId } from '../../hooks';

export function useModalLoader() {
  const id = useId();
  const { showLoadingOf, hideLoadingOf } = useContext(ModalLoaderContext);

  const showLoading = useBound((message: ReactNode) => showLoadingOf(id, message));

  const hideLoading = useBound(() => hideLoadingOf(id));

  return {
    showLoading,
    hideLoading,
  };
}
