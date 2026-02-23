import type { WindowState } from './WindowsModels';
import { stringify } from 'flatted';
import { is } from '@anupheaus/common';

const argsReplacer = (_key: string, value: unknown) => (is.function(value) ? value.toString() : value);

/** Primitives only - used for persistence (windows with complex args cannot be persisted) */
export function isSimpleArgs(args: unknown[]): boolean {
  return args.every(arg =>
    arg === null || arg === undefined ||
    typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean');
}

/**
 * Creates a stable hash of window args for consistent identification across browser sessions.
 * Same args produce the same id, enabling focus-existing-window behavior and localStorage persistence.
 */
export function createWindowIdFromArgs(definitionId: string, args: unknown[]): string {
  if (args.length === 0) return definitionId;
  const argsKey = stringify(args, argsReplacer);
  return `${definitionId}:${argsKey.hash()}`;
}

function reorderWindows<StateType extends WindowState = WindowState>(states: StateType[], previousOrder: string[]): [StateType[], string[]] {
  let oldStates = states.slice();
  const newStates = [];
  for (const id of previousOrder) {
    const state = oldStates.findById(id);
    if (state) {
      newStates.push(state);
      oldStates = oldStates.remove(state);
    }
  }
  newStates.push(...oldStates);
  return [newStates, newStates.ids()];
}

export const windowsUtils = {
  reorderWindows,
};
