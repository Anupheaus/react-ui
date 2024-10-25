import { useContext, useEffect, useLayoutEffect } from 'react';
import { createComponent } from '../Component';
import { GridSpecContext } from './GridSpecContext';
import { useId } from '../../hooks';

interface Props {
  width: number;
  columns: number;
}

export const GridSpec = createComponent('GridSpec', ({
  width,
  columns,
}: Props) => {
  const { isValid, setSpec, deleteSpec } = useContext(GridSpecContext);
  const id = useId();

  if (!isValid) throw new Error('GridSpec must be used inside a Grid component.');

  useLayoutEffect(() => {
    setSpec(id, width, columns);
  }, [width, columns]);

  useEffect(() => () => {
    deleteSpec(id);
  }, []);

  return null;
});