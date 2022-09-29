import { pureFC } from '../../anuxComponents';
import { InternalText, InternalTextProps } from '../InternalText';
import { TextTheme } from './TextTheme';

interface Props extends InternalTextProps { }

export const Text = pureFC<Props>()('Text', TextTheme, () => ({}), props => {
  return (
    <InternalText
      {...props}
      type={'text'}
      tagName={'text'}
    />
  );
});
