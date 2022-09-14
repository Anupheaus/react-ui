import { createElement, CSSProperties, useCallback, useMemo } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { AnyObject } from 'anux-common';
import { TooltipRenderer } from '../Tooltip/TooltipRenderer';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  name: string;
  width?: string | number;
}

export const Tag = anuxPureFC<Props>('Tag', ({ name, children, logging, enableLogging, ...rest }, passedRef) => {
  const { style: providedStyle, width, ...props } = {
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

  const style = useMemo(() => {
    const newStyle: CSSProperties = {
      ...providedStyle,
      width: width ?? providedStyle?.width,
    };
    if (Object.keys(newStyle).length === 0) return undefined;
    return newStyle;
  }, [providedStyle, width]);

  const content = createElement(
    name,
    { key: name, ...props, style, ref },
    children,
  );

  return (
    <TooltipRenderer>
      {content}
    </TooltipRenderer>
  );
});
