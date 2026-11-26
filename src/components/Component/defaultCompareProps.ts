import '../../extensions/is';
import type { AnyObject } from '@anupheaus/common';
import { is, to } from '@anupheaus/common';
import type { ReactElement } from 'react';
import { isDynamicFunction, markDynamicFunction } from './dynamicFunctions';

const primitiveTypes = new Set(['number', 'string', 'boolean']);

// A plain boolean on purpose: is.proxy's type guard (value is ProxyOf<unknown>, i.e. {}) would narrow an unknown value to never.
const isProxy = (value: unknown): boolean => is.proxy(value);

interface ComparePropsConfig {
  debug: boolean;
  name: string;
  topLevelProps: unknown;
  whitelistFunctions: PropertyKey[];
}

/** Returns true when the two values are equivalent for re-render purposes. */
type CompareProps = (prevProps: unknown, newProps: unknown, propertyName: PropertyKey) => boolean;

export function defaultCompareProps({ debug, name, topLevelProps, whitelistFunctions }: ComparePropsConfig): CompareProps {
  const whitelistSet = new Set(whitelistFunctions);
  const doCompare = (prevProps: unknown, newProps: unknown, propertyName: PropertyKey, suppressFunctionWarning = false): boolean => {
    if (prevProps === newProps) return true;
    if (prevProps == null || newProps == null) return false;
    const prevType = typeof prevProps;
    if (prevType !== typeof newProps) return false;
    if (primitiveTypes.has(prevType)) return false;
    if (isProxy(prevProps) || isProxy(newProps)) {
      const actualPrevProps = is.proxy(prevProps) ? to.proxyApi(prevProps)?.value : prevProps;
      const actualNewProps = is.proxy(newProps) ? to.proxyApi(newProps)?.value : newProps;
      return doCompare(actualPrevProps, actualNewProps, propertyName, suppressFunctionWarning);
    }
    if (is.function(prevProps)) {
      if (is.function(newProps)) {
        if (prevProps === newProps) return true;
        // Whitelisting a prop here registers the function itself, so it stays whitelisted everywhere it
        // flows next — descendant components need not whitelist it again (see dynamicFunctions).
        if (whitelistSet.has(propertyName)) { markDynamicFunction(newProps); return false; }
        if (isDynamicFunction(newProps)) return false;
        if (!suppressFunctionWarning) {

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
      return prevProps.every((value: unknown, index: number) => doCompare(value, newProps[index], index, suppressFunctionWarning));
    }
    if (is.reactElement(prevProps)) {
      // Same typeof as prevProps (checked above); compared field by field like the element it is expected to be.
      const newElement = newProps as ReactElement;
      if (prevProps.type !== newElement.type) return false;
      if (prevProps.key !== newElement.key) return false;
      // functions inside a child element's props belong to that child, not this component
      return doCompare(prevProps.props, newElement.props, propertyName, true);
    }
    if (is.plainObject(prevProps)) {
      // Same typeof as prevProps (checked above), so an object.
      const newObject = newProps as AnyObject;
      const prevKeys = Object.keys(prevProps);
      if (prevKeys.length !== Object.keys(newObject).length) return false;
      return prevKeys.every(key => doCompare((prevProps as AnyObject)[key], newObject[key], key, suppressFunctionWarning));
    }
    return false;
  };

  if (debug) {
    return (prevProps: unknown, newProps: unknown) => {
      const result = doCompare(prevProps, newProps, 'props');
       
      console.log(`${name} - debug`, { prevProps, newProps, result });
      return result;
    };
  }
  return doCompare;
}
