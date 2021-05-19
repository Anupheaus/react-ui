import { useState } from 'react';

export function useForceUpdate(): () => void {
  const [, setValue] = useState({});
  return () => setValue({});
}
