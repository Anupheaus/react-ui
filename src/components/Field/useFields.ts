import { AnyObject, DeepPartial, is } from '@anupheaus/common';
import { useBatchUpdates, useBound, useId } from '../../hooks';
import { useMemo, useRef } from 'react';

type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;

type ValueTypeOf<Name extends keyof SourceType, SourceType> = SourceType[Name];

type StringKeyOf<T> = keyof T extends string ? keyof T : never;

export function useFields<SourceType>(source: SourceType | (() => SourceType), onChange: (updatedValue: SourceType) => void, dependencies: unknown[] = []) {
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
  function useField<Name extends string, ValueType>(name: Name, onGet?: (value: SourceType) => ValueType, onSet?: (value: ValueType) => DeepPartial<SourceType>, defaultValue?: () => ValueType) {
    if (!is.function(onGet)) onGet = (value: SourceType) => (value as AnyObject)[name] as ValueType;
    if (!is.function(onSet)) onSet = (value: ValueType) => ({ [name]: value ?? null } as unknown as DeepPartial<SourceType>);

    const value = onGet(batchUpdateRef.current) ?? defaultValue?.();

    const setValue = useBound((updatedValue: ValueType) => {
      const changes = onSet!(updatedValue ?? defaultValue?.() as ValueType);
      batchUpdateRef.current = Object.merge({}, batchUpdateRef.current, changes);
      batchUpdate.onComplete(id, () => onChange(batchUpdateRef.current));
    });

    return {
      [name]: value,
      [`set${name.toPascalCase()}`]: setValue,
    };
  }

  return useField;
}
