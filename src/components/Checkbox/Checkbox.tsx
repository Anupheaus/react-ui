import { ChangeEvent, ComponentProps, MouseEvent, ReactNode } from 'react';
import { createComponent } from '../Component';
import { Label } from '../Label';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { Skeleton } from '../Skeleton';
import { AssistiveLabel } from '../AssistiveLabel';
import { createStyles2 } from '../../theme';
import { useUIState } from '../../providers';

interface Props extends ComponentProps<typeof Label> {
  value?: boolean;
  label?: ReactNode;
  error?: ReactNode;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  assistiveText?: ReactNode;
  children?: ReactNode;
  onChange?(value: boolean): void;
}
const useStyles = createStyles2(({ animation, action: { default: defaultAction, active: activeAction, disabled: disabledAction }, activePseudoClasses }) => ({
  checkbox: {
    display: 'flex',
    flex: 'auto',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  checkboxContainer: {
    display: 'flex',
    flex: 'none',
    gap: 8,
    cursor: 'default',
  },
  checkboxArea: {
    ...defaultAction,
    ...animation,
    display: 'flex',
    flex: 'none',
    backgroundColor: 'transparent',
    borderColor: defaultAction.backgroundColor,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 4,
    transitionProperty: 'border-color',
    cursor: 'pointer',
    position: 'relative',
    width: 'min-content',

    '&::after': {
      content: '""',
      ...defaultAction,
      position: 'absolute',
      inset: 2,
      backgroundColor: defaultAction.backgroundColor,
      borderRadius: 2,
      opacity: 0,
      transitionProperty: 'opacity, background-color',
    },

    '&.is-checked::after': {
      opacity: 1,
    },

    [activePseudoClasses]: {
      borderColor: activeAction.backgroundColor,

      '&::after': {
        backgroundColor: activeAction.backgroundColor,
      },
    },

    '&.is-read-only': {
      ...disabledAction,
      pointerEvents: 'none',
      backgroundColor: 'transparent',
      borderColor: disabledAction.backgroundColor,

      '&::after': {
        backgroundColor: disabledAction.backgroundColor,
      },
    },
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
    cursor: 'inherit',
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
}));

export const Checkbox = createComponent('Checkbox', ({
  className,
  value,
  help,
  isOptional,
  label,
  error,
  labelPosition = 'right',
  assistiveText,
  children = null,
  onChange,
}: Props) => {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();

  const handleValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    onChange?.(event.target.checked);
  });
  const toggleValue = useBound((event: MouseEvent) => {
    event.stopPropagation();
    if (isReadOnly) return;
    onChange?.(!value);
  });

  const preventPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  return (
    <Tag name="checkbox" className={join(css.checkbox, css[`label_position_${labelPosition}`], className)}>
      <Tag name="checkbox-container" onMouseDown={preventPropagation} className={join(css.checkboxContainer, css[`label_position_container_${labelPosition}`])}>
        <Skeleton className={css.skeleton}>
          <Tag name="checkbox-area" className={join(css.checkboxArea, value === true && 'is-checked', isReadOnly && 'is-read-only', className)} onClick={toggleValue}>
            <input type="checkbox" className={css.inputCheckbox} checked={value ?? false} onChange={handleValueChanged} />
          </Tag>
        </Skeleton>
        <Label help={help} isOptional={isOptional} onClick={toggleValue}>{label ?? children}</Label>
      </Tag>
      <AssistiveLabel error={error} className={css.assistiveText}>{assistiveText}</AssistiveLabel>
    </Tag>
  );
});
