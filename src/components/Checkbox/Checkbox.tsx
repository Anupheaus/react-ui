import type { ChangeEvent, ComponentProps, MouseEvent, ReactNode } from 'react';
import { createComponent } from '../Component';
import { ErrorIcon } from '../../errors';
import { Label } from '../Label';
import { Tag } from '../Tag';
import { useBound } from '../../hooks';
import { Skeleton } from '../Skeleton';
import { AssistiveLabel } from '../AssistiveLabel';
import { createStyles } from '../../theme';

interface Props extends ComponentProps<typeof Label> {
  value?: boolean;
  label?: ReactNode;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  assistiveText?: ReactNode;
  children?: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  onChange?(value: boolean): void;
}

const useStyles = createStyles(({ activePseudoClasses, field: { value: { normal: fieldNormal } }, action: { normal: actionNormal }, transition }) => ({
  checkbox: {
    display: 'flex',
    flexGrow: 0,
    flexShrink: 1,
    gap: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    // '--checkbox-color': 'transparent',

    // [activePseudoClasses]: {
    //   '--checkbox-color': actionNormal.backgroundColor,
    // },
  },
  checkboxIsChecked: {
    // '--checkbox-color': checkedColor,

    [activePseudoClasses]: {
      // '--checkbox-color': activeColor,
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
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 4,
    transitionProperty: 'border-color',
    cursor: 'pointer',
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
    cursor: 'pointer',
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
  assistiveText,
  width,
  minWidth,
  children = null,
  onChange,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const handleValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked));
  const toggleValue = useBound((event: MouseEvent) => {
    event.stopPropagation();
    onChange?.(!value);
  });

  const preventPropagation = useBound((event: MouseEvent) => event.stopPropagation());

  const style = useInlineStyle(() => ({
    minWidth: minWidth ?? width,
    width
  }), [width, minWidth]);

  return (
    <Tag name="checkbox" className={join(css.checkbox, value === true, css[`label_position_${labelPosition}`], className)} style={style}>
      <Tag name="checkbox-container" onMouseDown={preventPropagation} className={join(css.checkboxContainer, css[`label_position_container_${labelPosition}`])}>
        <Skeleton className={css.skeleton}>
          <Tag name="checkbox-area" className={join(css.checkboxArea, className)} onClick={toggleValue}>
            <input type="checkbox" className={css.inputCheckbox} checked={value ?? false} onChange={handleValueChanged} />
            <Tag name="checkbox-area-checked" className={join(css.checkboxAreaChecked, value === true && 'is-checked')} />
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
