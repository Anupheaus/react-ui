import { useState } from 'react';

export function useForceUpdate() {
  const [, setValue] = useState({});
  return () => setValue({});
}
