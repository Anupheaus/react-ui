import { createElement, useCallback } from 'react';
import { anuxPureFC } from '../anuxComponents';
import { AnyObject } from 'anux-common';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  name: string;
}

export const Tag = anuxPureFC<Props>('Tag', ({ name, children, logging, enableLogging, ...rest }, passedRef) => {
  const props = {
    class: rest.className,
    is: 'custom-element',
    ...rest,
  };
  delete props.className;
  delete (props as AnyObject)['classname'];

  const ref = useCallback((element?: HTMLElement) => {
    if (element) {
      if (element.attributes.getNamedItem('is') != null) element.attributes.removeNamedItem('is');
    }
    passedRef?.(element ?? null);
  }, [passedRef]);

  return createElement(
    name,
    { key: name, ...props, ref },
    children,
  );
});
