import { createComponent } from '../Component';
import type { InternalTextProps } from '../InternalText';
import { InternalText } from '../InternalText';

interface Props extends InternalTextProps<string> {
  multiline?: number;
}

export const Text = createComponent('Text', (props: Props) => {
  return (
    <InternalText
      {...props}
      type={'text'}
      tagName={'text'}
    />
  );
});
