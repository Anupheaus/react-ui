import type { DeepPartial } from '@anupheaus/common';
import { useBound } from '../../hooks';

type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;

export function useField<Name extends string, SourceType, ValueType>(name: Name, value: SourceType, onChange: (updatedValue: SourceType) => void,
  onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>): UseField<Name, ValueType>;
export function useField<Name extends string, SourceType, ValueType>(name: Name, value: SourceType, onChange: (updatedValue: SourceType) => void,
  onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>, defaultValue: () => ValueType): UseFieldWithDefault<Name, ValueType>;
export function useField<Name extends string, SourceType, ValueType>(name: Name, source: SourceType, onChange: (updatedValue: SourceType) => void,
  onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>, defaultValue?: () => ValueType) {
  const value = onGet(source) ?? defaultValue?.();

  const setValue = useBound((updatedValue: ValueType) => {
    const changes = onSet(updatedValue ?? defaultValue?.() as ValueType);
    onChange(Object.merge({}, source, changes));
  });

  return {
    [name]: value,
    [`set${name.toPascalCase()}`]: setValue,
  };
}
