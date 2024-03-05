import { DeepPartial } from '@anupheaus/common';
import { useBound } from '../../hooks';

type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;

export function useFields<SourceType>(source: SourceType, onChange: (updatedValue: SourceType) => void) {
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>): UseField<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue: () => ValueType): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>, defaultValue?: () => ValueType) {
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

  return useField;
}
