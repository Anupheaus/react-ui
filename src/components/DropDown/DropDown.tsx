import { createComponent } from '../Component';
import { InternalDropDown, InternalDropDownProps } from '../InternalDropDown';

interface Props<T extends string> extends InternalDropDownProps<T> { }

export const DropDown = createComponent('DropDown', function <T extends string>(props: Props<T>) {
  return (
    <InternalDropDown {...props} tagName="dropdown" />
  );
});