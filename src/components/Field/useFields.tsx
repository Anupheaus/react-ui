import type { AnyObject, DeepPartial, PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useBound, useForceUpdate,useObservable } from '../../hooks';
import type { FunctionComponent } from 'react';
import { useMemo, useRef } from 'react';
import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';

type FieldValueProps = { value?: any; onChange?(newValue: any): PromiseMaybe<void>; };

export type FieldComponent<P extends FieldValueProps = FieldValueProps> = FunctionComponent<P> | ReactUIComponent<(props: P) => JSX.Element | null>;

type GetValueTypeFrom<P extends FieldValueProps> = NonNullable<P['value']>;

export type FieldComponentProps<SourceType, ComponentProps extends AnyObject> = {
  component: FieldComponent<ComponentProps>;
  field: FieldOf<SourceType>;
  defaultValue?: GetValueTypeFrom<ComponentProps> | (() => GetValueTypeFrom<ComponentProps>);
} & Omit<ComponentProps, 'defaultValue' | 'field' | 'value' | 'onChange'>;


type UseField<Name extends string, ValueType> = Record<Name, ValueType> & Record<`set${Capitalize<Name>}`, (updatedValue: ValueType) => void> 
& Record<'Field', ReactUIComponent<<ComponentProps extends AnyObject>(props: FieldComponentProps<NonNullable<ValueType>, ComponentProps>) => JSX.Element | null>>;

type UseFieldWithDefault<Name extends string, ValueType> = UseField<Name, NonNullable<ValueType>>;


type ValueTypeOf<Name extends keyof SourceType, SourceType> = SourceType[Name];

type FieldOf<SourceType> = keyof SourceType extends string ? keyof SourceType : never;
// type ToString<P> = P extends string ? P : '';
// type CreateField<P, Prefix extends string | void = void> = `${Prefix extends string ? `${ToString<Prefix>}.` : ''}${ToString<keyof P>}`;
// type FieldsOf<P, Prefix extends string | void = void> = CreateField<P, Prefix>
//   | (P[keyof P] extends {} ? FieldsOf<P[keyof P], CreateField<P, Prefix>> : never);

function internalUseFields<SourceType>(target: (SourceType | undefined) | (() => (SourceType | undefined)), onChange?: (updatedValue: (SourceType | undefined)) => void, 
  dependencies: unknown[] = Array.empty()) {  
  const { get, set, onChange: onChangeObservable } = useObservable(target, dependencies);
  
  onChangeObservable((newValue: SourceType | undefined)=>onChange?.(newValue));

  function useField<Name extends FieldOf<SourceType>>(name: Name): UseField<Name, ValueTypeOf<Name, SourceType>>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>): UseField<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet: (value: SourceType) => ValueType, onSet: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue: ValueType | (() => ValueType)): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet?: (value: SourceType) => ValueType, onSet?: (value: ValueType) => DeepPartial<SourceType>,
    defaultValue?: ValueType | (() => ValueType)): UseFieldWithDefault<Name, ValueType>;
  function useField<Name extends string, ValueType>(name: Name, onGet?: (value: SourceType) => ValueType, onSet?: (value: ValueType) => DeepPartial<SourceType>, 
    defaultValue?: ValueType | (() => ValueType)): any {
    if (!is.function(onGet)) onGet = (value: SourceType) => (value as AnyObject)[name] as ValueType;
    if (!is.function(onSet)) onSet = (value: ValueType) => ({ [name]: value } as unknown as DeepPartial<SourceType>);
    const refresh = useForceUpdate();
    const targetValue = get();
    const newValue = (targetValue!=null?onGet(targetValue) : undefined) ?? (is.function(defaultValue) ? defaultValue() : defaultValue);
    const valueRef = useRef(newValue);
    const isFirstTimeRef = useRef(true);
    
    if(isFirstTimeRef.current){
      isFirstTimeRef.current = false;
      refresh();
    }
    
    onChangeObservable((newTarget: SourceType | undefined)=>{
      const getNewValue = (newTarget==null?undefined: onGet!(newTarget)) ?? (is.function(defaultValue) ? defaultValue() : defaultValue);      
      if(valueRef.current===getNewValue) return; // no change
      valueRef.current = getNewValue;
      refresh();
    }); 
    
    if(newValue!==valueRef.current) valueRef.current = newValue;
    
    const setValue = useBound((updatedValue: ValueType | undefined) => {      
      const changes = onSet!(updatedValue ?? (is.function(defaultValue) ? defaultValue() : defaultValue) as ValueType);
      if((changes as AnyObject)[name]===undefined) {
        // remove the field from the target
        set(currentTargetValue=>(({ [name]: _ignore, ...restOfTarget })=>restOfTarget)(({ ...currentTargetValue, ...changes })) as SourceType);
      } else {
        // add or update the field to the target
        set(currentTargetValue=>({ ...currentTargetValue, ...changes }) as SourceType);
      }
    });    

    return {
      [name]: valueRef.current,
      [`set${name.toPascalCase()}`]: setValue,
      Field: internalUseFields(valueRef.current, setValue).Field,
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
