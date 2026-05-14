import '../../extensions/is';
import { is, to } from '@anupheaus/common';

const primitiveTypes = new Set(['number', 'string', 'boolean']);

interface ComparePropsConfig {
  debug: boolean;
  name: string;
  topLevelProps: unknown;
  whitelistFunctions: PropertyKey[];
}

export function defaultCompareProps({ debug, name, topLevelProps, whitelistFunctions }: ComparePropsConfig) {
  const whitelistSet = new Set(whitelistFunctions);
  const doCompare = (prevProps: any, newProps: any, propertyName: PropertyKey, suppressFunctionWarning = false): boolean => {
    if (prevProps === newProps) return true;
    if (prevProps == null || newProps == null) return false;
    const prevType = typeof prevProps;
    if (prevType !== typeof newProps) return false;
    if (primitiveTypes.has(prevType)) return false;
    if (is.proxy(prevProps) || is.proxy(newProps)) {
      const actualPrevProps = is.proxy(prevProps) ? to.proxyApi(prevProps)?.value : prevProps;
      const actualNewProps = is.proxy(newProps) ? to.proxyApi(newProps)?.value : newProps;
      return doCompare(actualPrevProps, actualNewProps, propertyName, suppressFunctionWarning);
    }
    if (is.function(prevProps)) {
      if (is.function(newProps)) {
        if (prevProps === newProps) return true;
        if (whitelistSet.has(propertyName)) return false;
        if (!suppressFunctionWarning) {
          // eslint-disable-next-line no-console
          console.warn(`The function provided in property "${propertyName.toString()}" of "${name}" has changed, please use useBound or whitelist the ` +
            `function by adding the property "data-whitelist-functions=['${propertyName.toString()}]" to the props being handed into the "${name}" component ` +
            'or by setting it in the configuration of the component.', { topLevelProps, newProps, whitelistFunctions });
        }
      }
      return false;
    }
    if (is.date(prevProps)) return is.date(newProps) ? prevProps.getTime() === newProps.getTime() : false;
    if (is.array(prevProps)) {
      if (!is.array(newProps) || prevProps.length !== newProps.length) return false;
      return prevProps.every((value: any, index: number) => doCompare(value, newProps[index], index, suppressFunctionWarning));
    }
    if (is.reactElement(prevProps)) {
      if (prevProps.type !== newProps.type) return false;
      if (prevProps.key !== newProps.key) return false;
      // functions inside a child element's props belong to that child, not this component
      return doCompare(prevProps.props, newProps.props, propertyName, true);
    }
    if (is.plainObject(prevProps)) {
      const prevKeys = Object.keys(prevProps);
      if (prevKeys.length !== Object.keys(newProps).length) return false;
      return prevKeys.every(key => doCompare(prevProps[key], newProps[key], key, suppressFunctionWarning));
    }
    return false;
  };

  if (debug) {
    return (prevProps: any, newProps: any) => {
      const result = doCompare(prevProps, newProps, 'props');
      // eslint-disable-next-line no-console
      console.log(`${name} - debug`, { prevProps, newProps, result });
      return result;
    };
  }
  return doCompare;
}
