import { useContext, useLayoutEffect } from 'react';
import { useId } from '../../hooks';
import { createComponent } from '../Component';
import { WindowProps } from './WindowRenderer';
import { WindowsContexts } from './WindowsContexts';

interface Props extends Omit<WindowProps, 'id'> { id?: string; }

export const Window = createComponent('Window', (props: Props) => {
  const id = useId();
  const registerApi = useContext(WindowsContexts.registerApi);
  const registerWindow = useContext(WindowsContexts.registerWindow);

  useLayoutEffect(() => registerWindow({ id, ...props }, registerApi), [props]);
  return null;
});
