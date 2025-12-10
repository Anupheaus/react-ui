import { is } from '@anupheaus/common';
import { useMemo, useRef } from 'react';
import { useCallbacks } from '../useCallbacks';

export function useObservable<T>(target: T | (() => T), dependencies: unknown[] = []) {
  const updatedDependencies = (!is.function(target) && !dependencies.includes(target)) ? dependencies.concat(target) : dependencies;
  const lastUpdatedDependencies = useRef(updatedDependencies);
  const targetRef = useRef(useMemo(() => is.function(target) ? target() : target, []));
  const { registerOutOfRenderPhaseOnly, invoke } = useCallbacks<((value: T) => void)>();

  if (!is.deepEqual(updatedDependencies, lastUpdatedDependencies.current)) {
    lastUpdatedDependencies.current = updatedDependencies;
    const newTarget = is.function(target) ? target() : target;
    if (targetRef.current != newTarget) {
      targetRef.current = newTarget;
      invoke(targetRef.current);
    }
  }

  return {
    get() { return targetRef.current; },
    set(value: T | ((value: T) => T)) {
      if (is.function(value)) value = value(targetRef.current);
      if (targetRef.current == value) return;
      targetRef.current = value;
      invoke(targetRef.current);
    },
    onChange: registerOutOfRenderPhaseOnly,
  };
}