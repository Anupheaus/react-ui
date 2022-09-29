import { to } from 'anux-common';
import { useMemo } from 'react';
import { pureFC } from '../../anuxComponents';
import { useBound } from '../../hooks';
import { Button } from '../Button';
import { InternalText, InternalTextProps } from '../InternalText';
import { NumberTheme } from './NumberTheme';

interface Props extends InternalTextProps<number> { }

export const Number = pureFC<Props>()('Number', NumberTheme, () => ({
  number: {
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    textAlign: 'center',
  },
}), ({
  endAdornments: providedEndAdornments,
  theme: {
    css,
    icons,
    ThemedComponent,
  },
  ...props
}) => {
  const increase = useBound(() => props.onChange?.(to.number(props.value, 0) + 1));
  const decrease = useBound(() => props.onChange?.(to.number(props.value, 0) - 1));

  const buttons = useMemo(() => [
    <ThemedComponent
      component={Button}
      themeDefinition={({ backgroundColor }) => ({ backgroundColor })}
      key="increase"
      icon={icons.increase}
      onClick={increase}
    />,
    ...(providedEndAdornments ?? []),
  ], [providedEndAdornments]);

  const startButtons = useMemo(() => [
    <ThemedComponent
      component={Button}
      themeDefinition={({ backgroundColor }) => ({ backgroundColor })}
      key="decrease"
      icon={icons.decrease}
      onClick={decrease}
    />,
  ], []);

  return (
    <InternalText
      {...props}
      tagName={'number'}
      inputClassName={css.number}
      type={'number'}
      endAdornments={buttons}
      startAdornments={startButtons}
    />
  );
});
