// import { AnyObject } from '@anupheaus/common';
// import { DistributedState, useDistributedState } from '../../hooks';
// import { InternalFormState } from './InternalFormModels';
// import { useState } from 'react';
// import { capitalize } from '@mui/material';

// interface Props<T extends AnyObject, K extends keyof T> {
//   isOptional?: boolean;
//   defaultValue?(): T[K];
// }

// export type UseFormField<T extends AnyObject> = ReturnType<typeof createUseFormField<T>>;

// // type ToUseField<K extends string> = `set${Capitalize<K>}`;
// type UseFormFieldResultFields<T extends AnyObject, K extends keyof T> = {
//   value: K;
//   onChange: K extends string ? `set${Capitalize<K>}` : never;
// };

// type UseFormFieldResult<T extends AnyObject, K extends keyof T> = {
//   [P in keyof UseFormFieldResultFields<T, K> as UseFormFieldResultFields<T, K>[P]]: P extends 'value' ? T[K] : (newValue: T[K]) => void;
// };

// export function createUseFormField<T extends AnyObject>(state: DistributedState<InternalFormState<T>>) {
//   return <K extends keyof T>(field: K, props?: Props<T, K>): UseFormFieldResult<T, K> => {
//     const { modify, get, onChange } = useDistributedState(state);
//     const fieldName = field as string;
//     const [value, setValue] = useState<T[K] | undefined>(get().data[fieldName] ?? props?.defaultValue?.());
//     onChange(s => setValue(v => v === s.data[fieldName] ? v : s.data[fieldName]));
//     const onChangeValue = (newValue: T[K]) => modify(s => ({ ...s, data: { ...s.data, [field]: newValue } }));
//     return { [field]: value, [`set${capitalize(field as string)}`]: onChangeValue } as UseFormFieldResult<T, K>;
//   };
// }
