import { ChangeEvent, ComponentProps, ReactNode } from 'react';
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

export const Checkbox = createComponent({
  id: 'Checkbox',

  styles: ({ useTheme }) => {
    const { definition: transitionSettings } = useTheme(TransitionTheme);
    const { definition: { backgroundColor, uncheckedColor, checkedColor } } = useTheme(CheckboxTheme);
    return {
      styles: {
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
        },
        checkboxArea: {
          display: 'flex',
          flex: 'none',
          backgroundColor,
          borderColor: uncheckedColor,
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
        checkboxAreaIsChecked: {
          borderColor: checkedColor,
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
          backgroundColor: uncheckedColor,
          borderRadius: 2,
        },
        checkboxAreaCheckedIsChecked: {
          backgroundColor: checkedColor,
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
  },

  //render: function <T>(props: Props<T>) {
  render({
    className,
    value,
    help,
    isOptional,
    label,
    labelPosition = 'right',
    assistiveText,
    children = null,
    onChange,
  }: Props, { css, join }) {
    const handleValueChanged = useBound((event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked));

    const toggleValue = useBound(() => onChange?.(!value));

    return (
      <Tag name="checkbox" className={join(css.checkbox, css[`label_position_${labelPosition}`], className)}>
        <Tag name="checkbox-container" className={join(css.checkboxContainer, css[`label_position_container_${labelPosition}`])}>
          <Skeleton className={css.skeleton}>
            <Tag name="checkbox-area" className={join(css.checkboxArea, value === true && css.checkboxAreaIsChecked, className)}>
              <input type="checkbox" className={css.inputCheckbox} checked={value} onChange={handleValueChanged} />
              <Tag name="checkbox-area-checked" className={join(css.checkboxAreaChecked, value === true && css.checkboxAreaCheckedIsChecked)} />
            </Tag>
          </Skeleton>
          <Label help={help} isOptional={isOptional} onClick={toggleValue}>{label ?? children}</Label>
        </Tag>
        <AssistiveLabel className={css.assistiveText}>{assistiveText}</AssistiveLabel>
      </Tag>
    );
  },

  onError: error => <ErrorIcon error={error} />,

});
