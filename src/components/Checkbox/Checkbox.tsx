import type { ChangeEvent, ComponentProps, MouseEvent, ReactNode } from 'react';
import { createComponent } from '../Component';
import { ErrorIcon } from '../../errors';
import { Label } from '../Label';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { Skeleton } from '../Skeleton';
import { AssistiveLabel } from '../AssistiveLabel';
import { createStyles } from '../../theme';
import { useUIState } from '../../providers';

interface Props extends ComponentProps<typeof Label> {
  value?: boolean;
  label?: ReactNode;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  assistiveHelp?: ReactNode;
  children?: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  wide?: boolean;
  onChange?(value: boolean): void;
}

const useStyles = createStyles(({ field: { value: { normal: fieldNormal } }, action: { normal: actionNormal }, transition, pseudoClasses }) => ({
  checkbox: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    gap: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    '--checkbox-cursor': 'pointer',
    // '--checkbox-color': 'transparent',

    // [activePseudoClasses]: {
    //   '--checkbox-color': actionNormal.backgroundColor,
    // },

    '&.full-width': {
      flexGrow: 1,
    },

    [pseudoClasses.readOnly]: {
      '--checkbox-cursor': 'default',
    },
  },
  checkboxIsChecked: {
    // '--checkbox-color': checkedColor,    
  },
  checkboxContainer: {
    display: 'flex',
    flex: 'none',
    gap: 8,
    cursor: 'default',
    '&.full-width': {
      flexGrow: 1,
    },
  },
  checkboxArea: {
    display: 'flex',
    flex: 'none',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 4,
    transitionProperty: 'border-color',
    cursor: 'var(--checkbox-cursor)',
    position: 'relative',
    width: 'min-content',
    ...transition,
    ...fieldNormal,
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
    cursor: 'var(--checkbox-cursor)',
  },
  checkboxAreaChecked: {
    position: 'absolute',
    inset: 2,
    pointerEvents: 'none',
    opacity: 0,
    transitionProperty: 'opacity, background-color',
    backgroundColor: actionNormal.backgroundColor,
    borderRadius: 2,
    ...transition,

    '&.is-checked': {
      opacity: 1,
    },
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
  labelPosition = 'right',
  assistiveHelp,
  width,
  minWidth,
  wide = false,
  children = null,
  onChange,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const { isReadOnly } = useUIState();
  const handleValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked));
  const toggleValue = useBound((event: MouseEvent) => {
    event.stopPropagation();
    if (isReadOnly) return;
    onChange?.(!value);
  });

  const preventPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  const style = useInlineStyle(() => ({
    minWidth: minWidth ?? width,
    width
  }), [width, minWidth]);

  return (
    <Tag name="checkbox" className={join(css.checkbox, value === true, css[`label_position_${labelPosition}`], isReadOnly && 'is-read-only', wide && 'full-width', className)} style={style}>
      <Tag name="checkbox-container" onMouseDown={preventPropagation} className={join(css.checkboxContainer, css[`label_position_container_${labelPosition}`], wide && 'full-width')}>
        <Skeleton className={css.skeleton}>
          <Tag name="checkbox-area" className={join(css.checkboxArea, className)}>
            <input type="checkbox" className={css.inputCheckbox} checked={value ?? false} onChange={handleValueChanged} disabled={isReadOnly} />
            <Tag name="checkbox-area-checked" className={join(css.checkboxAreaChecked, value === true && 'is-checked')} />
          </Tag>
        </Skeleton>
        <Label help={help} isOptional={isOptional} onClick={toggleValue} wide={wide}>{label ?? children}</Label>
      </Tag>
      <AssistiveLabel className={css.assistiveText}>{assistiveHelp}</AssistiveLabel>
    </Tag>
  );
}, {
  onError: error => <ErrorIcon error={error} />,
});
