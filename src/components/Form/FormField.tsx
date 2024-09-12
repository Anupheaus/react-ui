import { FunctionComponent } from 'react';
import { DistributedState } from '../../hooks';
import { ReactUIComponent, createComponent } from '../Component';
import { AnyObject, PromiseMaybe } from '@anupheaus/common';
import { InternalFormState } from './InternalFormModels';
import type { UseFormField } from './useFormField';

type FieldComponentProps = { value?: any; onChange?(newValue: any): PromiseMaybe<void>; };

export type FieldComponent<P extends FieldComponentProps = FieldComponentProps> = FunctionComponent<P> | ReactUIComponent<(props: P) => JSX.Element | null>;

type GetComponentProps<F extends FieldComponent> = F extends FunctionComponent<infer P> ? P : F extends ReactUIComponent<(props: infer L) => JSX.Element | null> ? L : never;

type GetValueTypeFrom<F extends FieldComponent> = NonNullable<GetComponentProps<F>['value']>;

export type FormFieldProps<F extends FieldComponent, D extends AnyObject> = {
  component: F;
  field: keyof D;
  defaultValue?: GetValueTypeFrom<F> | (() => GetValueTypeFrom<F>);
  isOptional?: boolean;
  refreshOnSubPropertyChange?: boolean;
} & Omit<GetComponentProps<F>, 'defaultValue' | 'field' | 'value' | 'onChange'>;

type Props<F extends FieldComponent, D extends AnyObject> = FormFieldProps<F, D> & {
  state: DistributedState<InternalFormState<D>>;
  useFormField: UseFormField<D>;
};

export const FormField = createComponent('FormField', function <P extends FieldComponent, D extends AnyObject>({
  component: Component,
  field,
  refreshOnSubPropertyChange,
  state,
  defaultValue,
  useFormField,
  ...props
}: Props<P, D>) {
  const { isOptional = false } = props;
  const formField = useFormField(field, { isOptional, /*refreshOnSubPropertyChange,*/ defaultValue });

  const value = formField[field];
  const fieldAsString = field as string;
  const onChange = ((formField as AnyObject)[`set${fieldAsString[0].toUpperCase()}${fieldAsString.slice(1)}`]) as (newValue: unknown) => PromiseMaybe<void>;

  return (
    <Component {...props as any} value={value} onChange={onChange} />
  );
});
