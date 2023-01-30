import { createStyles } from '../../theme/createStyles';
import { ChangeEvent, ComponentProps, MouseEvent, ReactNode } from 'react';
import { createComponent } from '../Component';
import { ErrorIcon } from '../../errors';
import { Label } from '../Label';
import { CheckboxTheme } from './CheckboxTheme';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { TransitionTheme } from '../../theme/themes/TransitionTheme';
import { Skeleton } from '../Skeleton';
import { AssistiveLabel } from '../AssistiveLabel';

interface Props extends ComponentProps<typeof Label> {
  value?: boolean;
  label?: ReactNode;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  assistiveText?: ReactNode;
  children?: ReactNode;
  onChange?(value: boolean): void;
}
const useStyles = createStyles(({ activePseudoClasses, useTheme }) => {
  const transitionSettings = useTheme(TransitionTheme);
  const { backgroundColor, uncheckedColor, checkedColor, activeColor } = useTheme(CheckboxTheme);
  return {
    styles: {
      checkbox: {
        display: 'flex',
        flex: 'auto',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',
        '--checkbox-color': uncheckedColor,

        [activePseudoClasses]: {
          '--checkbox-color': activeColor,
        },
      },
      checkboxIsChecked: {
        '--checkbox-color': checkedColor,

        [activePseudoClasses]: {
          '--checkbox-color': activeColor,
        },
      },
      checkboxContainer: {
        display: 'flex',
        flex: 'none',
        gap: 8,
        cursor: 'default',
      },
      checkboxArea: {
        display: 'flex',
        flex: 'none',
        backgroundColor,
        borderColor: 'var(--checkbox-color)',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 4,
        transitionProperty: 'border-color',
        ...transitionSettings,
        cursor: 'pointer',
        position: 'relative',
        width: 'min-content',
      },
      assistiveText: {
        alignSelf: 'flex-start',
      },
      inputCheckbox: {
        opacity: 0,
        width: 16,
        height: 16,
        margin: 0,
        padding: 0,
      },
      checkboxAreaChecked: {
        position: 'absolute',
        inset: 2,
        pointerEvents: 'none',
        opacity: 0,
        transitionProperty: 'opacity, background-color',
        ...transitionSettings,
        backgroundColor: 'var(--checkbox-color)',
        borderRadius: 2,
      },
      checkboxAreaCheckedIsChecked: {
        opacity: 1,
      },
      skeleton: {
        borderRadius: 4,
      },
      label_position_right: {},
      label_position_left: {
        alignItems: 'flex-end'
      },
      label_position_top: {
        alignItems: 'center',
      },
      label_position_bottom: {
        alignItems: 'center',
      },
      label_position_container_right: {},
      label_position_container_left: {
        flexDirection: 'row-reverse',
      },
      label_position_container_top: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
      },
      label_position_container_bottom: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  };
});

export const Checkbox = createComponent('Checkbox', ({
  className,
  value,
  help,
  isOptional,
  label,
  labelPosition = 'right',
  assistiveText,
  children = null,
  onChange,
}: Props) => {
  const { css, join } = useStyles();
  const handleValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked));
  const toggleValue = useBound((event: MouseEvent) => {
    event.stopPropagation();
    onChange?.(!value);
  });

  const preventPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  return (
    <Tag name="checkbox" className={join(css.checkbox, value === true && css.checkboxIsChecked, css[`label_position_${labelPosition}`], className)}>
      <Tag name="checkbox-container" onMouseDown={preventPropagation} className={join(css.checkboxContainer, css[`label_position_container_${labelPosition}`])}>
        <Skeleton className={css.skeleton}>
          <Tag name="checkbox-area" className={join(css.checkboxArea, className)} onClick={toggleValue}>
            <input type="checkbox" className={css.inputCheckbox} checked={value ?? false} onChange={handleValueChanged} />
            <Tag name="checkbox-area-checked" className={join(css.checkboxAreaChecked, value === true && css.checkboxAreaCheckedIsChecked)} />
          </Tag>
        </Skeleton>
        <Label help={help} isOptional={isOptional} onClick={toggleValue}>{label ?? children}</Label>
      </Tag>
      <AssistiveLabel className={css.assistiveText}>{assistiveText}</AssistiveLabel>
    </Tag>
  );
}, {
  onError: error => <ErrorIcon error={error} />,
});
