const onlyStrings = (value: string | boolean | undefined | null) => typeof (value) === 'string' && value.length > 0;

/**
 * @deprecated Please use styles.make and classes.join from the result of useStyles.
 */
export function useJoinClassNames(): (...names: (string | boolean | undefined | null)[]) => (string | undefined) {
  return (...names) => {
    const validNames = names.filter(onlyStrings).cast<string>();
    if (validNames.length === 0) { return undefined; }
    return validNames.join(' ');
  };
}
