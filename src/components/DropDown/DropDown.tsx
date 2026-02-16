import { createComponent } from '../Component';
import type { InternalDropDownProps } from '../InternalDropDown';
import { InternalDropDown } from '../InternalDropDown';

export interface DropDownProps extends InternalDropDownProps { }

export const DropDown = createComponent('DropDown', function (props: DropDownProps) {
  return (
    <InternalDropDown {...props} tagName="dropdown" />
  );
});