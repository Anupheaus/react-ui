import { FunctionComponent, useContext, createElement } from 'react';
import { CustomTagContext, ICustomTagContext } from './context';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name: string;
}

export const CustomTag: FunctionComponent<IProps> = ({ name, children, ...rest }) => {
  const { prefix = '' } = useContext(CustomTagContext) || {} as ICustomTagContext;
  const separator = prefix.length > 0 ? '-' : '';
  name = `${prefix}${separator}${name}`;

  rest = {
    class: rest['class'] || rest.className,
    ...(({ className, ...innerRest }) => innerRest)(rest),
  } as any;

  return createElement(
    name,
    { key: name, ...rest },
    children,
  );
};
