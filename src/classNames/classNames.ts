import * as React from 'react';

declare module 'react' {

  function classNames(names: string[]): string;

}

const isNotEmpty = (value: string) => typeof (value) === 'string' && value.length > 0;
const toLowerCase = (value: string) => value.toLowerCase();

Object.defineProperty(React, 'classNames', {
  value(names: string[]): string {
    const validNames = names.filter(isNotEmpty).map(toLowerCase);
    if (validNames.length === 0) { return undefined; }
    return validNames.join(' ');
  },
  enumerable: false,
  configurable: true,
});
