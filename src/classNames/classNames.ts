const isNotEmpty = (value: string) => typeof (value) === 'string' && value.length > 0;
const toLowerCase = (value: string) => value.toLowerCase();

export function classNames(names: string[]): string {
  const validNames = names.filter(isNotEmpty).map(toLowerCase);
  if (validNames.length === 0) { return undefined; }
  return validNames.join(' ');
}
