import { createElement, useCallback } from 'react';
import { anuxPureFC } from '../anuxComponents';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  name: string;
}

export const Tag = anuxPureFC<Props>('Tag', ({ name, children, ...rest }, passedRef) => {
  const props = {
    class: rest.className,
    is: 'custom-element',
    ...rest,
  };
  delete rest.className;

  const ref = useCallback((element?: HTMLElement) => {
    element?.attributes.removeNamedItem('is');
    passedRef?.(element ?? null);
  }, [passedRef]);

  return createElement(
    name,
    { key: name, ...props, ref },
    children,
  );
});
