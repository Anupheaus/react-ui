import type { PopoverOrigin, PopoverProps } from '@mui/material';
import { Popover } from '@mui/material';
import type { FocusEvent, ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { useAsync, useBooleanState, useBound, useDOMRef, useId, useOnResize } from '../../hooks';
import type { ListItemEvent } from '../../models';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { FieldProps } from '../Field';
import { Field, useFieldAria } from '../Field';
import { Tag } from '../Tag';
import { UIState, useUIState, useValidation } from '../../providers';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { InternalList } from '../InternalList';
import { addOptionalItemTo, optionalItemKey } from './addOptionalItemTo';

const useStyles = createStyles(({ pseudoClasses, menu: { normal } }) => ({
  dropDown: {
    minWidth: 75,
  },
  dropDownContent: {
    alignItems: 'center',
    gap: 4,
    padding: '0 8px',

    // Match the touch-device sizing of the text input (see InternalText/InputStyles.ts) so dropdowns and text fields line up on touch devices.
    [pseudoClasses.tablet]: {
      fontSize: '1.2em',
      padding: '8px 12px',
    },
  },
  popover: {
    ...normal,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '0 4px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  dropDownListContent: {
    overflow: 'hidden',
  },
  // Only there to carry an id for the open button's name; it must not change how the value is laid out.
  selectedValue: {
    display: 'contents',
  },
}));

export interface InternalDropDownProps extends FieldProps {
  value?: string;
  values?: ReactListItem[];
  endAdornments?: ReactNode;
  readOnlyValue?: ReactNode;
  optionalItemLabel?: ReactNode;
  onFilterValues?(values: ReactListItem[]): PromiseMaybe<ReactListItem[]>;
  onChange?(id: string | undefined): void;
  onBlur?(event: FocusEvent<HTMLDivElement>): void;
}

interface Props extends InternalDropDownProps {
  tagName: string;
  renderSelectedValue?(value: ReactListItem | undefined): ReactNode;
  /**
   * Set by a multi-select (`Chips`), whose selection is a list rather than one of `values`: how many items are
   * selected. Required validation then checks that at least one is, and an optional field offers no "N/A" option,
   * because an empty selection already means none.
   */
  selectionCount?: number;
}

const defaultOnFilterValues = (values: ReactListItem[]) => values;

export const InternalDropDown = createComponent('InternalDropDown', function <T extends string>({
  value: providedValue,
  values: providedValues,
  isOptional,
  requiredMessage = 'Please select a value',
  endAdornments: providedEndAdornments,
  readOnlyValue,
  optionalItemLabel,
  onFilterValues = defaultOnFilterValues,
  renderSelectedValue,
  onChange,
  onBlur,
  selectionCount,
  ...props
}: Props) {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  const { response: rawValues, isLoading: isLoadingValues } = useAsync(() => onFilterValues(providedValues ?? []), [providedValues, onFilterValues]);
  const isMultiSelect = selectionCount != null;
  const values = useMemo(
    () => (isMultiSelect ? rawValues ?? [] : addOptionalItemTo(rawValues, isOptional, optionalItemLabel)),
    [rawValues, isOptional, optionalItemLabel, isMultiSelect],
  );
  const value = useMemo(() => values.findById(providedValue ?? optionalItemKey), [providedValue, values]);
  const anchorRef = useRef<HTMLElement | null>(null);
  const { target: resizeTarget, width } = useOnResize({ observeWidthOnly: true });
  const innerRef = useDOMRef([props.ref, anchorRef, resizeTarget]);
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false);
  const { validate } = useValidation({ id: `${props.tagName}-${props.label}` });

  const click = useBound((event: ListItemEvent<T>) => {
    const item = values.findById(event.id);
    if (item == null) return;
    setIsClosed();
    onChange?.(event.id === optionalItemKey ? undefined : event.id);
  });

  const selectedValue = useMemo(() => {
    if (isReadOnly && readOnlyValue != null) return readOnlyValue;
    if (is.function(renderSelectedValue)) return renderSelectedValue(value);
    if (value?.id === optionalItemKey && optionalItemLabel === null) return '';
    return ReactListItem.render(value);
  }, [value, isReadOnly, readOnlyValue, optionalItemLabel, renderSelectedValue]);

  const openDropDown = useBound(() => {
    if (isReadOnly || isOpen) return;
    setIsOpen();
  });

  // A multi-select's value never resolves to one of the options, so it is the selection count that must be present.
  const requiredValue = isMultiSelect ? (selectionCount > 0 ? selectionCount : undefined) : value;
  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(requiredValue, !isOptional, requiredMessage));

  const shownError = props.error ?? error;
  const valueId = useId();
  const { ids: ariaIds, controlProps: ariaProps } = useFieldAria({ label: props.label, error: shownError, assistiveHelp: props.assistiveHelp });
  // The button is the drop-down's one focusable control and has no text of its own: it is named by the field's label and
  // then the value, so a screen reader says "Colour, Red, button" rather than "button".
  const buttonLabelledBy = ariaProps['aria-labelledby'] == null ? valueId : `${ariaProps['aria-labelledby']} ${valueId}`;

  const handleClosed = useBound(() => {
    enableErrors();
    setIsClosed();
  });

  const handleOnBlur = useBound((event: FocusEvent<HTMLDivElement>) => {
    onBlur?.(event);
    if (!isOpen) enableErrors();
  });

  const endAdornments = useMemo(() => (
    <>
      <Button
        key="dropdown-open"
        aria-labelledby={buttonLabelledBy}
        aria-describedby={ariaProps['aria-describedby']}
        aria-invalid={ariaProps['aria-invalid']}
        aria-haspopup="listbox"
        onSelect={openDropDown}
      >
        <Icon name="dropdown" />
      </Button>
      {providedEndAdornments}
    </>
  ), [providedEndAdornments, openDropDown, buttonLabelledBy, ariaProps]);

  const anchorOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: 'right',
    vertical: 'bottom',
  }), []);

  const transformOrigin = useMemo<PopoverOrigin>(() => ({
    horizontal: 'right',
    vertical: 'top',
  }), []);

  const slotProps = useMemo<PopoverProps['slotProps']>(() => ({
    paper: {
      className: css.popover,
      style: {
        minWidth: width,
      },
    }
  }), [width, css.popover]);

  return (
    <UIState isLoading={isLoadingValues}>
      <Field
        {...props}
        error={shownError}
        ariaIds={ariaIds}
        isOptional={isOptional}
        ref={innerRef}
        className={join(css.dropDown, props.className)}
        contentClassName={css.dropDownContent}
        endAdornments={endAdornments}
        onContainerSelect={openDropDown}
        onBlur={handleOnBlur}
      >
        <Tag name="dropdown-selected-value" id={valueId} className={css.selectedValue}>{selectedValue}</Tag>
        <Popover
          open={isOpen}
          anchorEl={anchorRef.current}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          slotProps={slotProps}
          onClose={handleClosed}
        >
          <InternalList
            tagName={`${props.tagName}-list`}
            items={values}
            className={css.dropDownListContent}
            onClick={click}
          />
        </Popover>
      </Field>
    </UIState>
  );
});