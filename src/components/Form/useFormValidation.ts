// import { is, PromiseMaybe } from '@anupheaus/common';
// import { ReactNode, useContext, useLayoutEffect } from 'react';
// import { useForceUpdate, useId } from '../../hooks';
// import { FormContext } from './FormContext';

// interface ValidationHelpers {
//   validateRequired(value: unknown, isRequired: boolean, requiredMessage?: ReactNode): void | ReactNode | undefined;
// }

// function createHelpers(): ValidationHelpers {
//   return {
//     validateRequired: (value: unknown, isRequired: boolean, requiredMessage: ReactNode = 'This field is required') => {
//       if (!isRequired) return undefined;
//       if (value == null) return requiredMessage;
//       if (typeof (value) === 'string' && value.trim() === '') return requiredMessage;
//       if (typeof (value) === 'number' && isNaN(value)) return requiredMessage;
//     },
//   };
// }

// export function useFormValidation(...delegates: ((helpers: ValidationHelpers) => PromiseMaybe<void | ReactNode | undefined>)[]): ReactNode {
//   const { errors } = useContext(FormContext);
//   const id = useId();
//   const update = useForceUpdate();

//   const setError = (error: void | ReactNode | undefined) => {
//     if (error != null) {
//       errors.upsert({ id, message: error });
//     } else {
//       errors.remove(id);
//     }
//   };

//   const error = delegates.findMap(delegate => {
//     const result = delegate(createHelpers());
//     if (is.promise(result)) {
//       const setErrorAndUpdate = (response: void | ReactNode | undefined) => { setError(response); update(); };
//       result.then(setErrorAndUpdate, setErrorAndUpdate);
//       return true;
//     } else {
//       return result;
//     }
//   }) as void | boolean | ReactNode | undefined;

//   useLayoutEffect(() => setError(error), [error]);

//   return (error === true ? (errors.get(id)?.message ?? 'Validation result pending...') : error) ?? null;
// }