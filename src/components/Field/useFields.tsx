import type { AnyObject, DeepPartial, PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useBatchUpdates, useBound, useId } from '../../hooks';
import type { FunctionComponent } from 'react';
import { useMemo, useRef } from 'react';
import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';

type FieldValueProps = { value?: any; onChange?(newValue: any): PromiseMaybe<void>; };

export type FieldComponent<P extends FieldValueProps = FieldValueProps> = FunctionComponent<P> | ReactUIComponent<(props: P) => JSX.Element | null>;

type GetValueTypeFrom<P extends FieldValueProps> = NonNullable<P['value']>;

export type FieldComponentProps<SourceType, ComponentProps extends AnyObject> = {
  component: FieldComponent<ComponentProps>;
  field: StringKeyOf<SourceType>;
  defaultValue?: GetValueTypeFrom<ComponentProps> | (() => GetValueTypeFrom<ComponentProps>);
} & Omit<ComponentProps, 'defaultValue' | 'field' | 'value' | 'onChange'>;


type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;


type ValueTypeOf<Name extends keyof SourceType, SourceType> = SourceType[Name];

type StringKeyOf<T> = keyof T extends string ? keyof T : never;

function internalUseFields<SourceType>(source: (SourceType | undefined) | (() => (SourceType | undefined)), onChange?: (updatedValue: (SourceType | undefined)) => void, dependencies: unknown[] = []) {
  if (!is.function(source) && !dependencies.includes(source)) dependencies.push(source);
  const actualSource = useMemo(() => is.function(source) ? source() : source, dependencies);
  const batchUpdate = useBatchUpdates();
  const batchUpdateRef = useRef(actualSource);
  const id = useId();

  if (batchUpdateRef.current !== actualSource) batchUpdateRef.current = actualSource;

  function useField<Name extends StringKeyOf<SourceType>>(name: Name): UseField<Name, ValueTypeOf<Name, SourceType>>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>): UseField<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue: () => ValueType): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet?: (value: SourceType) => ValueType, onSet?: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue?: () => ValueType): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet?: (value: SourceType) => ValueType, onSet?: (value: ValueType) => DeepPartial<SourceType>, defaultValue?: () => ValueType) {
    if (!is.function(onGet)) onGet = (value: SourceType) => (value as AnyObject)[name] as ValueType;
    if (!is.function(onSet)) onSet = (value: ValueType) => ({ [name]: value ?? null } as unknown as DeepPartial<SourceType>);

    const value = (batchUpdateRef.current != null ? onGet(batchUpdateRef.current) : undefined) ?? defaultValue?.();

    const setValue = useBound((updatedValue: ValueType) => {
      const changes = onSet!(updatedValue ?? defaultValue?.() as ValueType);
      batchUpdateRef.current = Object.merge({}, batchUpdateRef.current, changes);
      batchUpdate.onComplete(id, () => onChange?.(batchUpdateRef.current));
    });

    return {
      [name]: value,
      [`set${name.toPascalCase()}`]: setValue,
    };
  }

  const Field = useMemo<ReactUIComponent<<ComponentProps extends AnyObject>(_props: FieldComponentProps<SourceType, ComponentProps>) => null | JSX.Element>>(() =>
    createComponent('UseFieldsFieldComponent', ({ component: Component, field, defaultValue, ...props }) => {
      const { [field]: value, [`set${field.toPascalCase()}`]: setValue } = useField(field, undefined, undefined, defaultValue) as AnyObject;

      return (
        <Component 
          {...props as any} 
          value={value} 
          onChange={setValue}
        />
      );
    }), []);

  return {
    useField,
    Field,
  };
}

// eslint-disable-next-line max-len
export function useFields<SourceType>(source: SourceType | undefined | (() => (SourceType | undefined)), onChange?: (updatedValue: (SourceType | undefined)) => void, dependencies?: unknown[]): ReturnType<typeof internalUseFields<SourceType>>;
// eslint-disable-next-line max-len
export function useFields<SourceType>(source: SourceType | undefined | (() => (SourceType | undefined)), onChange?: (updatedValue: SourceType) => void, dependencies?: unknown[]): ReturnType<typeof internalUseFields<SourceType>>;
export function useFields<SourceType>(source: SourceType | (() => SourceType), onChange: (updatedValue: SourceType) => void, dependencies?: unknown[]): ReturnType<typeof internalUseFields<SourceType>>;
export function useFields<SourceType>(source: (SourceType | undefined) | (() => (SourceType | undefined)), onChange?: (updatedValue: (SourceType | undefined)) => void, dependencies?: unknown[]) {
  return internalUseFields<SourceType>(source, onChange, dependencies);
}
