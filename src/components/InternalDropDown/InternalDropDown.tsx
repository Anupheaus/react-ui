import type { PopoverOrigin, PopoverProps } from '@mui/material';
import { Popover } from '@mui/material';
import type { FocusEvent, ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { useAsync, useBooleanState, useBound, useDOMRef, useOnResize } from '../../hooks';
import type { ListItemClickEvent } from '../../models';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { UIState, useUIState, useValidation } from '../../providers';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { InternalList } from '../InternalList';
import { addOptionalItemTo, optionalItemKey } from './addOptionalItemTo';

const useStyles = createStyles(({ menu: { normal } }) => ({
  dropDown: {
    minWidth: 75,
  },
  dropDownContent: {
    alignItems: 'center',
    gap: 4,
    padding: '0 8px',
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
  ...props
}: Props) {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  const { response: rawValues, isLoading: isLoadingValues } = useAsync(() => onFilterValues(providedValues ?? []), [providedValues, onFilterValues]);
  const values = useMemo(() => addOptionalItemTo(rawValues, isOptional, optionalItemLabel), [rawValues, isOptional, optionalItemLabel]);
  const value = useMemo(() => values.findById(providedValue ?? optionalItemKey), [providedValue, values]);
  const anchorRef = useRef<HTMLElement | null>(null);
  const { target: resizeTarget, width } = useOnResize({ observeWidthOnly: true });
  const innerRef = useDOMRef([props.ref, anchorRef, resizeTarget]);
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false);
  const { validate } = useValidation(`${props.tagName}-${props.label}`);

  const click = useBound((event: ListItemClickEvent<T>) => {
    const item = values.findById(event.id);
    if (item == null) return;
    setIsClosed();
    onChange?.(event.id === optionalItemKey ? undefined : event.id);
  });

  const selectedValue = useMemo(() => {
    if (isReadOnly && readOnlyValue != null) return readOnlyValue;
    if (is.function(renderSelectedValue)) return renderSelectedValue(value);
    return ReactListItem.render(value);
  }, [value, isReadOnly, readOnlyValue, renderSelectedValue]);

  const openDropDown = useBound(() => {
    if (isReadOnly || isOpen) return;
    setIsOpen();
  });

  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(value, !isOptional, requiredMessage));

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
      <Button key="dropdown-open" onSelect={openDropDown}>
        <Icon name="dropdown" />
      </Button>
      {providedEndAdornments}
    </>
  ), [providedEndAdornments]);

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
  }), [width]);

  return (
    <UIState isLoading={isLoadingValues}>
      <Field
        {...props}
        error={props.error ?? error}
        isOptional={isOptional}
        ref={innerRef}
        className={join(css.dropDown, props.className)}
        contentClassName={css.dropDownContent}
        endAdornments={endAdornments}
        onContainerSelect={openDropDown}
        onBlur={handleOnBlur}
      >
        {selectedValue}
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