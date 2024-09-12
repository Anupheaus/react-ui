import { AnyObject } from '@anupheaus/common';

export interface InternalFormState<T extends AnyObject = AnyObject> {
  data: Partial<T>;
  originalData: Partial<T>;
}
