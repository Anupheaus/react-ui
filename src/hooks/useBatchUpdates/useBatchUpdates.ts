import { unstable_batchedUpdates } from 'react-dom';
import { useEffect, useRef } from 'react';

interface Batch {
  id: string;
  callbacks: Map<string, () => void>;
}

const currentBatches: Batch[] = [];

function useInternalBatchUpdates() {
  const complete = (id: string) => {
    const index = currentBatches.findIndex(batch => batch.id === id);
    if (index === -1) return;
    const batch = currentBatches.splice(index, 1)[0];
    batch.callbacks.forEach(callback => callback());
  };
  return <T>(delegate: () => T): T => {
    const batchId = Math.uniqueId();
    currentBatches.push({ id: batchId, callbacks: new Map() });
    const result = unstable_batchedUpdates(delegate);
    if (result instanceof Promise) result.then(() => complete(batchId)); else complete(batchId);
    return result as T;
  };
}

type BatchUpdate = ReturnType<typeof useInternalBatchUpdates> & { onComplete(id: string, delegate: () => unknown): void; };

export function useBatchUpdates(): BatchUpdate {
  const batchUpdate = useInternalBatchUpdates() as BatchUpdate;
  const hookId = Math.uniqueId();
  const recordedCallbacks = useRef(new Set<[string, string]>()).current;

  batchUpdate.onComplete = (id, delegate) => {
    const callbackId = `${hookId}-${id}`;
    const currentBatch = currentBatches[currentBatches.length - 1];
    if (currentBatch == null) { delegate(); return; }
    currentBatch.callbacks.set(callbackId, delegate);
    recordedCallbacks.add([currentBatch.id, callbackId]);
  };

  useEffect(() => () => {
    recordedCallbacks.forEach(([batchId, callbackId]) => {
      const batch = currentBatches.findById(batchId);
      if (batch == null) return;
      batch.callbacks.delete(callbackId);
    });
  }, []);
  return batchUpdate;
}