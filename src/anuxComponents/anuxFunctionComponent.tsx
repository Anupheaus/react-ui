/* eslint-disable no-console */
import { AnyObject, is } from '@anupheaus/common';
import { ForwardRefRenderFunction, forwardRef, PropsWithChildren, ReactElement, RefObject, FunctionComponent, RefAttributes, memo, isValidElement, ReactNode } from 'react';
import { useInternalErrors } from '../errors/useInternalErrors';
import { FCTheme, Theme, ThemeStyles, ThemeTypes } from '../theme';

const isInDevelopmentMode = process.env.NODE_ENV === 'development';

export interface AnuxRef<T> extends RefObject<T> {
  (instance: T | null): void;
}

type AddDefaultChildren<Props> = Props extends { children: unknown; } ? Props : PropsWithChildren<Props>;
type AddTheme<Props, TTheme extends LocalFCTheme> = Props & TTheme;
// export interface LoggingProps {
//   /** Enable logging */
//   enableLogging?: boolean | 'log' | 'verbose' | 'warn' | 'error';
// }

// const weighting = { verbose: 4, log: 3, warn: 2, error: 1 };

// interface LoggingApi extends LoggingProps {
//   logging: {
//     log(...args: unknown[]): void;
//     warn(...args: unknown[]): void;
//     error(...args: unknown[]): void;
//     verbose(...args: unknown[]): void;
//   };
// }

type LocalFCTheme = FCTheme<ThemeTypes['definition'], ThemeTypes['icons'], ThemeTypes['styles']>;

export interface AnuxRefForwardingComponent<TProps extends {}, TTheme extends LocalFCTheme, TRef> extends ForwardRefRenderFunction<TRef, TProps> {
  (props: AddTheme<AddDefaultChildren<TProps>, TTheme>, ref: AnuxRef<TRef> | null): ReactElement | null;
}

export type AnuxFC<Props = {}, TRef = unknown> = Omit<FunctionComponent<Props & RefAttributes<TRef>>, '(props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: AddDefaultChildren<Props>, context?: any): ReactElement<any, any> | null;
};

function compareElement(name: string, prevElement: ReactElement, nextElement: ReactElement): boolean {
  if (is.function(prevElement) && is.function(nextElement) && prevElement.name !== nextElement.name) return false;
  if (prevElement.key !== nextElement.key) return false;
  if (prevElement.type !== nextElement.type) return false;
  return compareProps(name)(prevElement.props, nextElement.props);
}

function compareChildren(name: string, prevChildren: ReactNode, nextChildren: ReactNode): boolean {
  if (prevChildren === nextChildren) return true;
  if (isValidElement(prevChildren) && isValidElement(nextChildren)) return compareElement(name, prevChildren, nextChildren);
  if (prevChildren instanceof Array && nextChildren instanceof Array) {
    if (prevChildren.length !== nextChildren.length) return false;
    for (let i = 0; i < prevChildren.length; i++) {
      if (!compareChildren(name, prevChildren[i], nextChildren[i])) return false;
    }
    return true;
  }
  console.warn(`WARNING: Unnecessary render of ${name} due to the children not being equal or not being comparible:`, { prevChildren, nextChildren });
  return false;
}

function compareProps(name: string) {
  return ({ children: prevChildren, ...prevProps }: AnyObject, { children: nextChildren, ...nextProps }: AnyObject): boolean => {
    if (!is.shallowEqual(prevProps, nextProps)) {
      if (!isInDevelopmentMode) return false;
      if (!is.deepEqual(prevProps, nextProps)) return false;
      const changedProps = Object.keys(nextProps).filter(key => nextProps[key] !== prevProps[key] && is.deepEqual(nextProps[key], prevProps[key]));
      if (changedProps.length > 0) {
        console.warn(`WARNING: Unnecessary render of "${name}" due to the following properties:`, changedProps);
      }
    }
    return compareChildren(name, prevChildren, nextChildren);
  };
}

// const loggingCache = new Map<string, LoggingApi['logging']>();

// function addLoggingToProps<TProps extends {} = {}>(props: PropsWithChildren<TProps & LoggingProps>, name: string): AddDefaultChildren<TProps & LoggingApi> {
//   const enableLogging = isInDevelopmentMode ? props.enableLogging ?? false : false;
//   const key = `${name}|${enableLogging}`;
//   const logging = loggingCache.get(key) ?? (() => {
//     const createLog = (type: 'log' | 'warn' | 'error' | 'verbose') => (...args: unknown[]) => {
//       if (enableLogging == null || enableLogging === false) return;
//       if (typeof (enableLogging) === 'string' && weighting[enableLogging] < weighting[type]) return;
//       const method = type === 'verbose' ? 'log' : type;
//       const initialColor = type === 'log' ? '#6ae55a' : type === 'warn' ? '#ffc107' : type === 'error' ? '#ff0000' : '#919191';
//       console[method](`%c${name}%c:%c`, `color: ${initialColor}`, 'color: grey', 'color: white', ...args);
//     };
//     return {
//       log: createLog('log'),
//       warn: createLog('warn'),
//       error: createLog('error'),
//       verbose: createLog('verbose'),
//     };
//   })();
//   if (!loggingCache.has(key)) loggingCache.set(key, logging);
//   logging.log('PROPS', props);
//   return {
//     ...props as AddDefaultChildren<TProps & LoggingApi>,
//     logging,
//     enableLogging,
//   };
// }

export function anuxPureFC<TProps extends {} = {}, TRef = HTMLElement>(name: string, component: AnuxRefForwardingComponent<TProps, LocalFCTheme, TRef>): AnuxFC<TProps, TRef>;
export function anuxPureFC<TProps extends {} = {}, S extends ThemeTypes['styles'] = ThemeTypes['styles'], TRef = HTMLElement>(name: string,
  theme: S, component: AnuxRefForwardingComponent<TProps, S, TRef>): AnuxFC<TProps, TRef>;
export function anuxPureFC<TProps extends {} = {}, S extends ThemeTypes['styles'] = ThemeTypes['styles'], TRef = HTMLElement>(name: string,
  themeOrComponent: FCTheme<ThemeTypes['definition'], ThemeTypes['icons'], S> | AnuxRefForwardingComponent<TProps, S, TRef>, providedComponent?: AnuxRefForwardingComponent<TProps, S, TRef>): AnuxFC<TProps, TRef> {

  const component = (is.function(providedComponent) ? providedComponent : themeOrComponent) as AnuxRefForwardingComponent<TProps, S, TRef>;
  let result: any = forwardRef<TRef, TProps>((props, ref) => {
    // const { recordError } = useInternalErrors();
    // try {
    return component(props, ref as AnuxRef<TRef>);
    // } catch (error) {
    // recordError(error);
    // return null;
    // }
  });
  result = memo(result, compareProps(name));
  result.displayName = name;
  return result as AnuxFC<TProps, TRef>;
}

export function anuxGenericPureFC<PropsType extends {} = {}, RefType = HTMLElement>(name: string, props: AddDefaultChildren<PropsType & RefAttributes<RefType>>,
  component: AnuxRefForwardingComponent<PropsType, RefType>) {
  const Component = anuxPureFC(name, component);
  return <Component {...props} />;
}