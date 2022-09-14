import { is } from 'anux-common';
import { useRef } from 'react';
import { useBound } from '../hooks/useBound';

interface PromiseData {
  promise: Promise<unknown>;
  isResolvedOrRejected: boolean;
  resolve(value?: unknown): void;
  reject(reason?: unknown): void;
}

type PromiseResolver = {
  <T = void>(id: string, value: T): void;
  <T = void>(id: string): (value: T) => void;
};

type PromiseRejecter = {
  <T = unknown>(id: string, reason: T): void;
  <T = unknown>(id: string): (reason: T) => void;
};

export function usePromises() {
  const promises = useRef(new Map<string, PromiseData>()).current;

  const createPromise = useBound(<T = void>(id: string, timeout?: number): Promise<T> => {
    const existingPromise = promises.get(id) ?? { isResolvedOrRejected: true, promise: Promise.resolve(), resolve: () => void 0, reject: () => void 0 };
    if (!existingPromise.isResolvedOrRejected) throw new Error(`Promise with id ${id} already exists and has not yet been resolved or rejected.`);
    const promise = new Promise<unknown>((resolve, reject) => {
      existingPromise.isResolvedOrRejected = false;
      existingPromise.resolve = resolve;
      existingPromise.reject = reject;
      if ((timeout ?? 0) < 1) return;
      setTimeout(() => {
        if (existingPromise.isResolvedOrRejected) return;
        existingPromise.isResolvedOrRejected = true;
        reject('timeout');
      }, timeout);
    });
    existingPromise.promise = promise;
    return promise as Promise<T>;
  });

  const createResolveOrReject = (resolver: (promise: PromiseData) => (value: unknown) => void, type: string) => useBound((...args: unknown[]) => {
    const id = args[0] as string | undefined;
    if (is.empty(id)) throw new Error('Promise id is required.');
    const promise = promises.get(id);
    if (!promise) throw new Error(`Promise with id ${id} does not exist.`);
    if (promise.isResolvedOrRejected) return;

    if (args.length === 1) {
      return (value: unknown) => {
        promise.isResolvedOrRejected = true;
        resolver(promise)(value);
      };
    } else if (args.length === 2) {
      promise.isResolvedOrRejected = true;
      resolver(promise)(args[1]);
    } else {
      throw new Error(`Invalid number of arguments for the promise ${type} function.`);
    }
  });

  const resolve = createResolveOrReject(promise => promise.resolve, 'resolve') as PromiseResolver;
  const reject = createResolveOrReject(promise => promise.reject, 'reject') as PromiseRejecter;

  return {
    createPromise,
    resolve,
    reject,
  };
}