import type { PaperProps, PopoverOrigin } from '@mui/material';
import { Popover } from '@mui/material';
import type { FocusEvent, ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { useBooleanState, useBound, useDOMRef, useOnResize } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import { useUIState, useValidation } from '../../providers';
import { is } from '@anupheaus/common';
import { InternalList } from '../InternalList';
import { ListItem } from '../List';

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

export interface InternalDropDownProps<T extends string> extends FieldProps {
  value?: T | ReactListItem;
  values?: ReactListItem[];
  endAdornments?: ReactNode;
  onChange?(id: T, item: ReactListItem): void;
  onBlur?(event: FocusEvent<HTMLDivElement>): void;
}

interface Props<T extends string> extends InternalDropDownProps<T> {
  tagName: string;
  renderSelectedValue?(value: ReactListItem | undefined): ReactNode;
}

export const InternalDropDown = createComponent('InternalDropDown', function <T extends string>({
  value: providedValue,
  values,
  isOptional,
  requiredMessage = 'Please select a value',
  endAdornments: providedEndAdornments,
  renderSelectedValue,
  onChange,
  onBlur,
  ...props
}: Props<T>) {
  const { css, join } = useStyles();
  const { isReadOnly } = useUIState();
  const value = useMemo(() => is.string(providedValue) ? values?.findById(providedValue) : is.listItem(providedValue) ? providedValue : undefined, [providedValue, values]);
  const anchorRef = useRef<HTMLElement | null>(null);
  const { target: resizeTarget, width } = useOnResize({ observeWidthOnly: true });
  const innerRef = useDOMRef([props.ref, anchorRef, resizeTarget]);
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false);
  const { validate } = useValidation(`${props.tagName}-${props.label}`);

  const handleSelect = useBound((item: ReactListItem | Promise<ReactListItem>) => {
    if (is.promise(item)) return;
    setIsClosed();
    onChange?.(item.id as T, item);
  });

  const selectedValue = useMemo(() => {
    if (is.function(renderSelectedValue)) return renderSelectedValue(value);
    return ReactListItem.render(value);
  }, [value, renderSelectedValue]);

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

  const paperProps = useMemo<PaperProps>(() => ({
    className: css.popover,
    style: {
      minWidth: width,
    },
  }), [width]);

  return (
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
        PaperProps={paperProps}
        onClose={handleClosed}
      >
        <InternalList
          tagName={`${props.tagName}-list`}
          items={values}
          className={css.dropDownListContent}
        >
          <ListItem onSelect={handleSelect} />
        </InternalList>
      </Popover>
    </Field>
  );
});