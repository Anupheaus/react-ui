import { is } from 'anux-common';

const toLowerCase = (value: string) => value.toLowerCase();

export function useClasses(names: string[]): string {
  const validNames = names.filter(is.not.empty).map(toLowerCase);
  if (validNames.length === 0) { return undefined; }
  return validNames.join(' ');
}
