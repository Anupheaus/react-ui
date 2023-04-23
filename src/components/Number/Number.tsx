import { to } from '@anupheaus/common';
import { ReactElement, useMemo } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { createStyles, ThemesProvider } from '../../theme';
import { Button, ButtonTheme } from '../Button';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { NumberTheme } from './NumberTheme';
import { Icon } from '../Icon';

interface Props extends InternalTextProps<number | undefined> {
  min?: number;
  max?: number;
  endAdornments?: ReactElement[];
  hideIncreaseDecreaseButtons?: boolean;
}

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const numberTheme = useTheme(NumberTheme);
  const { backgroundColor } = numberTheme;

  return {
    styles: {
      number: {
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
        textAlign: 'center',
      },
      hiddenButtons: {
        'padding': '0 4px',
      },
    },
    variants: {
      buttonTheme: createThemeVariant(ButtonTheme, {
        backgroundColor,
      }),
      internalTextTheme: createThemeVariant(InternalTextTheme, numberTheme),
    },
  };
});

export const Number = createComponent('Number', ({
  endAdornments: providedEndAdornments,
  hideIncreaseDecreaseButtons = false,
  ...props
}: Props) => {
  const { css, variants, join } = useStyles();
  const increase = useBound(() => props.onChange?.(to.number(props.value, 0) + 1));
  const decrease = useBound(() => props.onChange?.(to.number(props.value, 0) - 1));

  const buttons = useMemo(() => [
    ...(hideIncreaseDecreaseButtons ? [] : [
      <Button
        key="increase"
        onClick={increase}
      >
        <Icon name="number-increase" size="small" />
      </Button>
    ]),
    ...(providedEndAdornments ?? []),
  ], [providedEndAdornments]);

  const startButtons = useMemo(() => hideIncreaseDecreaseButtons ? [] : [
    <Button
      key="decrease"
      onClick={decrease}
    >
      <Icon name="number-decrease" size="small" />
    </Button>,
  ], []);

  return (
    <ThemesProvider themes={join(variants.internalTextTheme, variants.buttonTheme)}>
      <InternalText
        {...props}
        tagName={'number'}
        inputClassName={join(css.number, hideIncreaseDecreaseButtons && css.hiddenButtons)}
        type={'number'}
        endAdornments={buttons}
        startAdornments={startButtons}
      />
    </ThemesProvider>
  );
});
