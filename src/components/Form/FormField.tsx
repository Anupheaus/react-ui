import { FocusEvent, ReactElement } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { useFormField } from './useFormField';

type ReactFC<T extends {}> = (props: T) => ReactElement<any, any> | null;
interface FieldComponent<T> {
  value?: T | undefined;
  onChange?(newValue: T): void;
}

type Props<P extends FieldComponent<T>, T> = {
  component: ReactFC<P>;
  field: T | undefined;
  defaultValue?: NonNullable<T>;
  isOptional?: boolean;
} & Omit<P, 'defaultValue' | 'field' | 'value' | 'onChange'>;

export const FormField = createComponent('FormField', function <P extends FieldComponent<T>, T>({ component: Component, field, defaultValue, ...props }: Props<P, T>) {
  const { isOptional = false } = props;
  const { value, error, set, onBlur } = useFormField(field, { isRequired: !isOptional });

  const handleBlur = useBound((event: FocusEvent) => {
    onBlur();
    if ('onBlur' in props) (props as any).onBlur(event);
  });

  return (
    <Component {...props as any} value={value} onChange={set} error={error} onBlur={handleBlur} />
  );
});