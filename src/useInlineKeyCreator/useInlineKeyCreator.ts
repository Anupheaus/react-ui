import { SharedHookState } from '../useSharedHookState';

interface ICreateKeyOptions {
  skipTraceFrames?: number;
  debug?: boolean;
}

export type CreateKeyType = (options?: ICreateKeyOptions) => string;
type SuffixUpdater = (suffix: string) => void;

const SharedKeyState = Symbol('SharedKeyState');

export function useInlineKeyCreator(sharedHookState: SharedHookState): [CreateKeyType, SuffixUpdater] {
  sharedHookState.current[SharedKeyState] = sharedHookState.current[SharedKeyState] || {
    suffix: '',
  };

  const getSuffix = () => sharedHookState.current[SharedKeyState].suffix || '';
  const setSuffix = (suffix: string) => { sharedHookState.current[SharedKeyState].suffix = suffix; };

  const createKey = (options?: ICreateKeyOptions) => {
    const { skipTraceFrames, debug } = {
      skipTraceFrames: 0,
      debug: false,
      ...options,
    };
    const suffix = getSuffix();
    const stackTrace = Function.getStackTrace();
    const frame = stackTrace[2 + skipTraceFrames];
    if (!frame) { throw new Error('Stack trace was not long enough (or skipTraceFrames was set too high) to provide a unique key for this method.'); }
    const key = `${frame.methodName}-${frame.file}-${frame.line}-${frame.column}${suffix.length > 0 ? `:${suffix}` : ''}`.hash(32);
    if (debug) { console.info({ stackTrace, frame, suffix, key }); }
    return key;
  };

  const suffixUpdater: SuffixUpdater = setSuffix;

  return [createKey, suffixUpdater];
}