import { useContext, createElement, forwardRef } from 'react';
import { CustomTagContext, ICustomTagContext } from './context';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name: string;
}

export const CustomTag = forwardRef<HTMLElement, IProps>(({ name, children, ...rest }, ref) => {
  const { prefix = '' } = useContext(CustomTagContext) || {} as ICustomTagContext;
  const separator = prefix.length > 0 ? '-' : '';
  name = `${prefix}${separator}${name}`;

  rest = {
    class: rest['class'] || rest.className,
    ...rest,
  } as any;
  delete rest.className;

  return createElement(
    name,
    { key: name, ...rest, ref },
    children,
  );
});
