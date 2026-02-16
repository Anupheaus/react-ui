import type { DataPagination, PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { PaperProps, PopoverOrigin } from '@mui/material';
import { Popover } from '@mui/material';
import type { FunctionComponent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBatchUpdates, useBooleanState, useBound, useDOMRef, useOnResize, useOnUnmount, useUpdatableState } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { Button } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import { MenuItem } from '../Menu';
import type { InternalTextProps } from '../InternalText';
import { InternalText } from '../InternalText';
import { UIState } from '../../providers';

const useStyles = createStyles(({ menu: { normal } }) => ({
  autocomplete: {
    minWidth: 75,
  },
  autocompleteContent: {
    alignItems: 'center',
    gap: 4,
    padding: '0 8px',
  },
  popover: {
    ...normal,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 4,
    boxSizing: 'border-box',
  },
}));

const fakeValues: ReactListItem[] = Array.ofSize(10).map((_, index) => ({ id: index.toString(), text: 'W'.repeat(Math.round(Math.random() * 25)) }));

interface SelectionRange {
  value?: string;
  start: number;
  end: number;
}

export interface AutocompletePopupProps {
  search: string;
}

interface Props extends Omit<InternalTextProps<string | ReactListItem>, 'onChange'> {
  values?: ReactListItem[];
  minSearchLength?: number;
  overridePopup?: FunctionComponent<AutocompletePopupProps>;
  renderSelectedValue?(item?: ReactListItem): ReactNode | void;
  onGetValues?(search: string, pagination?: DataPagination): PromiseMaybe<ReactListItem[]>;
  onChange?(id: string, item: ReactListItem): void;

}

export const Autocomplete = createComponent('Autocomplete', ({
  value: providedValue,
  values: providedValues,
  minSearchLength = 3,
  overridePopup: PopupOverride,
  renderSelectedValue,
  onGetValues,
  onChange,
  ...props
}: Props) => {
  const { css, join } = useStyles();
  const [values, setValues] = useUpdatableState<ReactListItem[]>(() => providedValues ?? [], [providedValues]);
  const [value, setValue] = useUpdatableState<string | undefined>(() => {
    return is.string(providedValue) ? values?.findById(providedValue)?.text : is.listItem(providedValue) ? providedValue.text : undefined;
  }, [providedValue, values]);
  const [selectionRange, setSelectionRange] = useState<SelectionRange>({ start: 0, end: 0 });
  const anchorRef = useRef<HTMLInputElement | null>(null);
  const { target: resizeTarget, width } = useOnResize({ observeWidthOnly: true });
  const innerRef = useDOMRef([props.ref, anchorRef, resizeTarget]);
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false);
  const hasUnmounted = useOnUnmount();
  const lastActionIdRef = useRef<string>('');
  const batchUpdates = useBatchUpdates();
  const [isLoadingValuesForDropDown, setIsLoadingValuesForDropDown, setIsFinishedLoadingValuesForDropDown] = useBooleanState(false);

  const renderItem = useMemo(() => (item: ReactListItem) => (<>
    {item.iconName != null && <Icon name={item.iconName as any} size={'small'} />}
    {item.label ?? item.text}
  </>), []);

  // const selectedValue = useMemo(() => {
  //   if (renderSelectedValue) {
  //     const result = renderSelectedValue(value);
  //     if (result !== undefined) return result;
  //   }
  //   return value != null ? renderItem(value) : null;
  // }, [value, renderSelectedValue]);


  // const handleContainerSelect = useBound(() => {
  //   if (isOpen) return;
  //   setIsOpen();
  // });

  const handleItemClick = useBound((item: ReactListItem) => (event: MouseEvent) => {
    item.onClick?.(ReactListItem.createClickEvent(event, item));
    setIsClosed();
    onChange?.(item.id, item);
  });

  const handleChanged = useBound((updatedValue: string) => batchUpdates(async () => {
    lastActionIdRef.current = Math.uniqueId();
    setValue(updatedValue);
    if (updatedValue.length < minSearchLength) return;
    let matchedValue: string | undefined;
    if (is.array(providedValues)) {
      matchedValue = providedValues.find(item => item.text.toLowerCase().startsWith(updatedValue.toLowerCase()))?.text;
    } else if (is.function(onGetValues)) {
      const lastActionId = lastActionIdRef.current;
      const newValues = await onGetValues(updatedValue, { limit: 1 });
      if (hasUnmounted() || lastActionId !== lastActionIdRef.current || newValues.length === 0) return;
      matchedValue = newValues[0]?.text;
    }
    if (is.empty(matchedValue)) return;
    setSelectionRange({ value: matchedValue, start: updatedValue.length, end: matchedValue.length });
  }));

  const renderedItems = useMemo(() => {
    if ((!is.array(values) && !isLoadingValuesForDropDown) || PopupOverride != null) return null;
    return (isLoadingValuesForDropDown ? fakeValues : values).map(item => {
      return (
        <MenuItem key={item.id} onSelect={handleItemClick(item)}>
          {renderItem(item)}
        </MenuItem>
      );
    });
  }, [values, isLoadingValuesForDropDown]);

  const loadValues = useBound(() => batchUpdates(async () => {
    const requestId = lastActionIdRef.current;
    setIsLoadingValuesForDropDown();
    setIsOpen();
    try {
      if (is.array(providedValues)) {
        setValues(providedValues.filter(item => is.empty(value) ? true : item.text.toLowerCase().startsWith(value.toLowerCase())));
      } else if (is.function(onGetValues)) {
        const newValues = await onGetValues?.(value ?? '');
        if (requestId !== lastActionIdRef.current) return;
        setValues(newValues);
      }
    } finally {
      setIsFinishedLoadingValuesForDropDown();
    }
  }));

  const endAdornments = useMemo(() => [(
    <Button key="dropdown-open" onSelect={loadValues} iconOnly={false}>
      <Icon name="dropdown" />
    </Button>
  )], []);

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

  const handleKeyDown = useBound((event: KeyboardEvent<HTMLInputElement>) => batchUpdates(() => {
    lastActionIdRef.current = Math.uniqueId();
    if (['Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) return;
    if (event.key === 'Backspace') {
      const selectionStart = anchorRef.current?.selectionStart ?? 0;
      const selectionEnd = anchorRef.current?.selectionEnd ?? 0;
      if (selectionStart === selectionEnd || selectionEnd === 0) return;
      setValue(v => v?.slice(0, v.length - 1));
      setSelectionRange(v => ({ ...v, start: selectionStart - 1, end: selectionEnd }));
      event.preventDefault();
    } else {
      setSelectionRange({ start: 0, end: 0 });
    }
  }));

  useLayoutEffect(() => {
    const { start, end } = selectionRange;
    if (start === 0 && end === 0) return;
    anchorRef.current?.setSelectionRange(start, end);
  }, [selectionRange]);

  return (<>
    <InternalText
      {...props}
      value={selectionRange.value ?? value}
      onChange={handleChanged}
      type="text"
      tagName="dropdown"
      ref={innerRef}
      onKeyDown={handleKeyDown}
      className={join(css.autocomplete, props.className)}
      endAdornments={endAdornments}
    />
    <Popover
      open={isOpen}
      anchorEl={anchorRef.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={paperProps}
      onClose={setIsClosed}
    >
      {PopupOverride != null ? <PopupOverride search={value ?? ''} /> : (
        <UIState isLoading={isLoadingValuesForDropDown}>
          {renderedItems}
        </UIState>
      )}
    </Popover>
  </>);
});