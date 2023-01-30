import { forwardRef, Ref } from 'react';
import { Component, ComponentRenderStyles, ComponentStyles, ComponentStylesConfig, ComponentSymbol } from './ComponentModels';
import { AnuxError } from '../../errors/types/AnuxError';
import { createStylesProps } from './createStylesProps';
import { AnyFunction } from '@anupheaus/common';
import { LocalErrorBoundary } from './LocalErrorBoundary';
import { useBound } from '../../hooks/useBound';

type OnErrorFunc<TProps extends {}> = (error: AnuxError, props: TProps) => JSX.Element | null;

interface ComponentConfig<TProps extends {}, TStyles extends ComponentStylesConfig> {
  id: string;
  styles?: ComponentStyles<TProps, TStyles>;
  render(props: TProps, styles: ComponentRenderStyles<TStyles>): JSX.Element | null;
  onError?: OnErrorFunc<TProps>;
}

function addIdToComponentFunc<TProps extends {}>(componentFunc: AnyFunction, id: string): Component<TProps> {
  const func = componentFunc as Component<TProps>;
  func.displayName = id;
  Reflect.defineProperty(func, 'name', { value: id, configurable: true, writable: false, enumerable: true });
  return func;
}

function wrapInLocalErrorBoundaryIfRequired<TProps extends {}>(InnerComponent: Component<TProps>, onError: OnErrorFunc<TProps> | undefined): Component<TProps> {
  if (onError == null) return InnerComponent;
  const wrappingFunc = forwardRef((props: TProps, ref: Ref<HTMLElement>) => {
    const handleOnError = useBound((error: AnuxError) => onError(error, props));
    return (
      <LocalErrorBoundary onError={handleOnError}>
        <InnerComponent {...props} ref={ref} />
      </LocalErrorBoundary>
    );
  });
  return addIdToComponentFunc(wrappingFunc, `ErrorBoundaryFor${InnerComponent.displayName}`);
}

export function createComponent3<TProps extends {}, TStyles extends ComponentStylesConfig>({ id, styles, render, onError }: ComponentConfig<TProps, TStyles>): Component<TProps> {
  const createStylesPropsFunc = createStylesProps<TProps, TStyles>(styles);
  const componentFunc = (forwardRef<any, any>((props: TProps, ref: Ref<HTMLElement>) => {
    try {
      const stylesProps = createStylesPropsFunc(props);
      return render({ ...props, ref }, stylesProps);
    } catch (error) {
      if (onError != null) return onError(new AnuxError({ error }), props);
      throw error;
    }
  }));
  const FinalComponent = wrapInLocalErrorBoundaryIfRequired(addIdToComponentFunc(componentFunc, id), onError);
  FinalComponent[ComponentSymbol] = true;
  return FinalComponent;
}
