/** @jsx jsx */
import { createElement, CSSProperties, DetailedHTMLProps, HTMLAttributes, Ref, useMemo } from 'react';
import { createComponent } from '../Component';
import { AnyObject } from '@anupheaus/common';
import { TooltipRenderer } from '../Tooltip/TooltipRenderer';
import { useDOMRef } from '../../hooks/useDOMRef';

interface Props extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref' | 'className'> {
  name: string;
  className?: string;
  width?: string | number;
  ref?: Ref<HTMLDivElement | null>;
}

export const Tag = createComponent('Tag', ({
  name,
  className,
  children,
  ref: passedRef,
  ...rest
}: Props) => {
  const { style: providedStyle, width, ...props } = {
    class: className,
    is: 'custom-element',
    ...rest,
  };
  delete (props as AnyObject)['classname'];

  const ref = useDOMRef([passedRef], {
    connected: element => {
      if (element.attributes.getNamedItem('is') != null) element.attributes.removeNamedItem('is');
    },
  });

  const style = useMemo(() => {
    const newStyle: CSSProperties = {
      ...providedStyle,
      width: width ?? providedStyle?.width,
    };
    if (Object.keys(newStyle).length === 0) return undefined;
    return newStyle;
  }, [providedStyle, width]);

  return (
    <TooltipRenderer>
      {createElement(
        name,
        { key: name, ...props, style, ref },
        children,
      )}
    </TooltipRenderer>
  );
});
