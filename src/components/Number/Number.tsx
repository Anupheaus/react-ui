import { to } from '@anupheaus/common';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { useBound } from '../../hooks';
import { ThemesProvider } from '../../theme';
import { Button, ButtonTheme } from '../Button';
import { InternalText, InternalTextProps, InternalTextTheme } from '../InternalText';
import { NumberTheme } from './NumberTheme';

interface Props extends InternalTextProps<number> { }

export const Number = createComponent({
  id: 'Number',

  styles: ({ useTheme, createThemeVariant }) => {
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
      },
      variants: {
        buttonTheme: createThemeVariant(ButtonTheme, {
          backgroundColor,
        }),
        internalTextTheme: createThemeVariant(InternalTextTheme, numberTheme),
      },
    };
  },

  render({
    endAdornments: providedEndAdornments,
    ...props
  }: Props, { css, variants, join }) {
    const increase = useBound(() => props.onChange?.(to.number(props.value, 0) + 1));
    const decrease = useBound(() => props.onChange?.(to.number(props.value, 0) - 1));

    const buttons = useMemo(() => [
      <Button
        key="increase"
        icon={'number-increase'}
        onClick={increase}
      />,
      ...(providedEndAdornments ?? []),
    ], [providedEndAdornments]);

    const startButtons = useMemo(() => [
      <Button
        key="decrease"
        icon={'number-decrease'}
        onClick={decrease}
      />,
    ], []);

    return (
      <ThemesProvider themes={join(variants.internalTextTheme, variants.buttonTheme)}>
        <InternalText
          {...props}
          tagName={'number'}
          inputClassName={css.number}
          type={'number'}
          endAdornments={buttons}
          startAdornments={startButtons}
        />
      </ThemesProvider>
    );
  },
});
