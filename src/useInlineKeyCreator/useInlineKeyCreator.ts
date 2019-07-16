import { IMap } from 'anux-common';
import { SharedHookState } from '../useSharedHookState';

type KeyCreator = () => string;
type SuffixUpdater = (suffix: string) => void;

const SharedKeyState = Symbol('SharedKeyState');

function createKey(): string {
  const stackTrace = Function.getStackTrace().skip(3).firstOrDefault();
  return `${stackTrace.file}-${stackTrace.line}-${stackTrace.column}`;
}

export function useInlineKeyCreator(sharedHookState: SharedHookState): [KeyCreator, SuffixUpdater] {
  const keyMap: IMap<string> = {};
  sharedHookState.current[SharedKeyState] = sharedHookState.current[SharedKeyState] || {
    suffix: '',
  };
  let keyCount = 0;

  const getSuffix = () => sharedHookState.current[SharedKeyState].suffix || '';
  const setSuffix = (suffix: string) => { sharedHookState.current[SharedKeyState].suffix = suffix; };

  const lookupKey = (key: string) => keyMap[key] = keyMap[key] || ((keyCount++) + 1000000).toString(16);

  const keyCreator: KeyCreator = () => {
    const suffix = getSuffix();
    return `${lookupKey(createKey())}${suffix.length !== 0 ? `:${suffix}` : ''}`;
  }

  const suffixUpdater: SuffixUpdater = setSuffix;

  return [keyCreator, suffixUpdater];
}