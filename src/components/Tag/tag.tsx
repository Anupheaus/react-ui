/** @jsx jsx */
import type { CSSProperties, DetailedHTMLProps, HTMLAttributes, Ref } from 'react';
import { createElement, useMemo } from 'react';
import { createComponent } from '../Component';
import type { AnyObject } from '@anupheaus/common';
import { TooltipRenderer } from '../Tooltip/TooltipRenderer';
import { useDOMRef } from '../../hooks/useDOMRef';

interface Props extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref' | 'className'> {
  name: string;
  className?: string;
  width?: string | number;
  ref?: Ref<HTMLDivElement | null>;
  testId?: string;
}

export const Tag = createComponent('Tag', ({
  name,
  className,
  children,
  ref: passedRef,
  testId,
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
    if (Object.values(newStyle).removeNull().length === 0) return undefined;
    return JSON.parse(JSON.stringify(newStyle));
  }, [providedStyle, width]);

  return (
    <TooltipRenderer>
      {createElement(
        name,
        { key: name, ...props, style, ref, 'data-testid': testId },
        children,
      )}
    </TooltipRenderer>
  );
});
