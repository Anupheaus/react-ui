import { createComponent } from '../Component';
import { InternalText, InternalTextProps } from '../InternalText';

interface Props extends InternalTextProps<string> { }

export const Text = createComponent('Text', (props: Props) => {
  return (
    <InternalText
      {...props}
      type={'text'}
      tagName={'text'}
    />
  );
});
