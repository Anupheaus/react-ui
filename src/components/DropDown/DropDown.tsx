import { createComponent } from '../Component';
import { InternalDropDown, InternalDropDownProps } from '../InternalDropDown';

interface Props extends InternalDropDownProps { }

export const DropDown = createComponent('DropDown', (props: Props) => {
  return (
    <InternalDropDown {...props} tagName="dropdown" />
  );
});