import { SharedHookState } from '../useSharedHookState';

interface ICreateKeyOptions {
  from: string;
  debug?: boolean;
}

export type CreateKeyType = (options: ICreateKeyOptions) => string;
type SuffixUpdater = (suffix: string) => void;

const SharedKeyState = Symbol('SharedKeyState');

export function useInlineKeyCreator(sharedHookState: SharedHookState): [CreateKeyType, SuffixUpdater] {
  sharedHookState[SharedKeyState] = sharedHookState[SharedKeyState] || {
    suffix: '',
  };

  const getSuffix = () => sharedHookState[SharedKeyState].suffix || '';
  const setSuffix = (suffix: string) => { sharedHookState[SharedKeyState].suffix = suffix; };

  function createKey(options?: ICreateKeyOptions) {
    const { from, debug } = {
      debug: false,
      ...options,
    };
    const suffix = getSuffix();
    const key = `${from}${suffix.length > 0 ? `:${suffix}` : ''}`.hash(32);
    if (debug) { console.info({ from, suffix, key }); }
    return key;
  }

  const suffixUpdater: SuffixUpdater = setSuffix;

  return [createKey, suffixUpdater];
}