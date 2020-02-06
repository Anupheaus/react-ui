import { createElement, useCallback } from 'react';
import { anuxPureFC } from '../anuxComponents';

interface IProps extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  name: string;
}

export const Tag = anuxPureFC<IProps>('Tag', ({ name, children, ...rest }, passedRef) => {
  rest = {
    class: rest['class'] ?? rest.className,
    is: 'custom-element',
    ...rest,
  } as unknown;
  delete rest.className;

  const ref = useCallback((element?: HTMLElement) => {
    element?.attributes.removeNamedItem('is');
    passedRef?.(element);
  }, [passedRef]);

  return createElement(
    name,
    { key: name, ...rest, ref },
    children,
  );
});
