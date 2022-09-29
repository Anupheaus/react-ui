import { unstable_batchedUpdates } from 'react-dom';

export function useBatchUpdates() {
  return <T>(delegate: () => T): T => {
    let result: unknown;
    unstable_batchedUpdates(() => {
      result = delegate();
    });
    return result as T;
  };
}