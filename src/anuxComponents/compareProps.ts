/* eslint-disable no-console */
import { AnyObject, is } from '@anupheaus/common';
import { isValidElement, ReactElement, ReactNode } from 'react';

const isInDevelopmentMode = process.env.NODE_ENV === 'development';

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

export function compareProps(name: string) {
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