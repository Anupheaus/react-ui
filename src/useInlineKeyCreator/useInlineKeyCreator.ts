import { SharedHookState } from '../useSharedHookState';
import { IFunctionStackTraceInfo } from 'anux-common/dist/extensions/function';
import { areShallowEqual } from '../areEqual';

type KeyCreator = () => string;
type SuffixUpdater = (suffix: string) => void;

const SharedKeyState = Symbol('SharedKeyState');

function createKey(parentStackTrace: IFunctionStackTraceInfo[], suffix: string): string {
  let stackTrace = Function.getStackTrace();
  parentStackTrace.forEach(parentItem => {
    const index = stackTrace.findIndex(item => areShallowEqual(item, parentItem));
    if (index >= 0) { stackTrace.splice(index, 1); }
  });
  let key = stackTrace.map(({ methodName, file, line, column }) => `${methodName}-${file}-${line}-${column}`).join(':');
  key += suffix.length > 0 ? `:${suffix}` : '';
  return key.hash(32);
}

export function useInlineKeyCreator(sharedHookState: SharedHookState): [KeyCreator, SuffixUpdater] {
  sharedHookState.current[SharedKeyState] = sharedHookState.current[SharedKeyState] || {
    suffix: '',
  };
  const parentStackTrace = Function.getStackTrace();

  const getSuffix = () => sharedHookState.current[SharedKeyState].suffix || '';
  const setSuffix = (suffix: string) => { sharedHookState.current[SharedKeyState].suffix = suffix; };

  const keyCreator: KeyCreator = () => {
    const suffix = getSuffix();
    return createKey(parentStackTrace, suffix);
  }

  const suffixUpdater: SuffixUpdater = setSuffix;

  return [keyCreator, suffixUpdater];
}