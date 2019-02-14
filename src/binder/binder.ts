import * as React from 'react';
import { IMap } from 'anux-common';

declare module 'react' {

  interface IBinderOptions {
    key?: string;
  }

  function binder<TFunc extends Function>(target: Object, value: TFunc, options?: IBinderOptions): TFunc;

}

interface IBinderEntry {
  binderFunc: Function;
  delegateFunc: Function;
}

const binders = new WeakMap<any, IMap<IBinderEntry>>();

Object.defineProperty(React, 'binder', {
  value<TFunc extends Function>(target: Object, value: TFunc, options: React.IBinderOptions = {}) {
    let memory: IMap<IBinderEntry> = binders.get(target);
    const key = options.key || value.toString();

    if (!memory) {
      memory = {};
      binders.set(target, memory);
    }

    if (!memory[key]) {
      memory[key] = {
        binderFunc: (...args: any[]) => {
          const func = memory[key].delegateFunc;
          return func(...args);
        },
        delegateFunc: null,
      };
    }
    const data = memory[key];
    data.delegateFunc = value; // update the bound data with the new function

    return data.binderFunc as TFunc; // return the bound function every time
  },
  enumerable: false,
  configurable: true,
});
// React['binder'] = ;
