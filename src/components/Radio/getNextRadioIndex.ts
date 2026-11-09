interface NextRadioIndexRequest {
  key: string;
  /** The option that has focus, or -1 when focus is not on one. */
  currentIndex: number;
  count: number;
}

const FORWARD_KEYS = ['ArrowDown', 'ArrowRight'];
const BACKWARD_KEYS = ['ArrowUp', 'ArrowLeft'];

/** The option an arrow key moves to, wrapping at either end, or `undefined` when the key does not move between options. */
export function getNextRadioIndex({ key, currentIndex, count }: NextRadioIndexRequest): number | undefined {
  if (count === 0 || currentIndex < 0) return undefined;
  if (FORWARD_KEYS.includes(key)) return (currentIndex + 1) % count;
  if (BACKWARD_KEYS.includes(key)) return (currentIndex - 1 + count) % count;
  return undefined;
}
