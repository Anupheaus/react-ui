import { ComponentProps, FocusEvent, FunctionComponent } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { useFormField } from './useFormField';
import { ProxyOf } from '@anupheaus/common';

type FieldComponent<P extends {} = {}> = FunctionComponent<P & { value?: unknown; onChange?(newValue: unknown): void; }>;

type GetValueTypeFrom<F extends FieldComponent, K extends keyof GetComponentProps<F>> = GetComponentProps<F>[K];
//T extends FieldComponent<{ ['value']?: infer V }> ? V | undefined : never;

type FieldAsType<F extends FieldComponent, K extends keyof GetComponentProps<F>> = {
  field: GetValueTypeFrom<F, K> | ProxyOf<GetValueTypeFrom<F, K>>;
};

type GetComponentProps<F extends FieldComponent> = F extends FieldComponent<infer P> ? P : never;

type ValueAsModifiedType<F extends FieldComponent, V, K extends keyof GetComponentProps<F>> = {
  field: V;
  onModifyValueIn(value: V): GetValueTypeFrom<F, K>;
  onModifyValueOut(value: GetValueTypeFrom<F, K>): V;
};

type Props<F extends FieldComponent, V, K extends keyof GetComponentProps<F>> = {
  component: F;
  valueField?: K;
  defaultValue?: NonNullable<GetValueTypeFrom<F, K>> | (() => NonNullable<GetValueTypeFrom<F, K>>);
  isOptional?: boolean;
  refreshOnSubPropertyChange?: boolean;
} & (FieldAsType<F, K> | ValueAsModifiedType<F, V, K>) & Omit<ComponentProps<F>, 'defaultValue' | 'field' | 'onChange' | K>;

export const FormField = createComponent('FormField', function <P extends FunctionComponent<any>, K extends keyof GetComponentProps<P> = 'value', V = unknown>({
  component: Component, field, defaultValue, valueField, refreshOnSubPropertyChange, ...props }: Props<P, V, K>) {
  const { isOptional = false } = props;
  const { nonce, value, set } = useFormField(field, { isRequired: !isOptional, refreshOnSubPropertyChange, defaultValue });

  const handleBlur = useBound((event: FocusEvent) => {
    // onBlur();
    if ('onBlur' in props) (props as any).onBlur(event);
  });

  const valueProp = { [valueField ?? 'value']: value };

  return (
    <Component key={nonce} {...props as any} {...valueProp} onChange={set} onBlur={handleBlur} />
  );
});
