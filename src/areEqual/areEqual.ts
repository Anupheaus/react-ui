// tslint:disable:no-console
import * as React from 'react';

declare module 'react' {

  function areDeepEqual(valueA: any, valueB: any): boolean;
  function areShallowEqual(valueA: any, valueB: any): boolean;

}

function compareElements(elementA: React.ReactElement<any>, elementB: React.ReactElement<any>): boolean | void {
  const isAElement = React.isValidElement(elementA);
  const isBElement = React.isValidElement(elementB);
  if (!isAElement && !isBElement) { return; }
  if (elementA.type !== elementB.type || elementA.key !== elementB.key) { return false; }
  return React.areDeepEqual(elementA.props, elementB.props);
}

function customComparer(objectA: any, objectB: any): boolean | void {
  if (objectA === objectB) { return true; }
  if (objectA == null || objectB == null) { return false; }
  if (typeof (objectA) !== typeof (objectB)) { return false; }
  if (typeof (objectA) !== 'object' || objectA instanceof Array) { return; }
  const result = compareElements(objectA, objectB);
  if (result === true || result === false) { return result; }
}

Object.defineProperty(React, 'areDeepEqual', {
  value: (valueA: any, valueB: any): boolean => Reflect.areDeepEqual(valueA, valueB, customComparer),
  enumerable: false,
  configurable: true,
});

Object.defineProperty(React, 'areShallowEqual', {
  value: (valueA: any, valueB: any): boolean => Reflect.areShallowEqual(valueA, valueB, customComparer),
  enumerable: false,
  configurable: true,
});
