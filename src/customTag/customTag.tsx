import { createElement } from 'react';
import { anuxFunctionComponent } from '../anuxComponents';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name: string;
}

export const CustomTag = anuxFunctionComponent<IProps>('CustomTag', ({ name, children, ...rest }, ref) => {
  rest = {
    class: rest['class'] || rest.className,
    ...rest,
  } as unknown;
  delete rest.className;

  return createElement(
    name,
    { key: name, ...rest, ref },
    children,
  );
});
