import { DeepPartial, is } from '@anupheaus/common';
import { useBound } from '../../hooks';
import { useMemo } from 'react';

type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;

export function useFields<SourceType>(source: SourceType | (() => SourceType), onChange: (updatedValue: SourceType) => void, dependencies: unknown[] = []) {
  if (!is.function(source) && !dependencies.includes(source)) dependencies.push(source);
  const actualSource = useMemo(() => is.function(source) ? source() : source, dependencies);

  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>): UseField<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue: () => ValueType): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>, defaultValue?: () => ValueType) {
    const value = onGet(actualSource) ?? defaultValue?.();

    const setValue = useBound((updatedValue: ValueType) => {
      const changes = onSet(updatedValue ?? defaultValue?.() as ValueType);
      onChange(Object.merge({}, actualSource, changes));
    });

    return {
      [name]: value,
      [`set${name.toPascalCase()}`]: setValue,
    };
  }

  return useField;
}
