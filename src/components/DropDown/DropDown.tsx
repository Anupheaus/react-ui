import { is } from '@anupheaus/common';
import { PaperProps, Popover, PopoverOrigin } from '@mui/material';
import { useMemo, useRef } from 'react';
import { useBooleanState, useBound, useDOMRef, useOnResize } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles, ThemesProvider } from '../../theme';
import { Button, ButtonTheme } from '../Button';
import { createComponent } from '../Component';
import { Icon } from '../Icon';
import { InternalField, InternalFieldProps } from '../InternalField';
import { DropDownTheme } from './DropDownTheme';

const useStyles = createStyles(({ useTheme, createThemeVariant }) => {
  const { menuItem } = useTheme(DropDownTheme);

  return {
    styles: {
      dropDown: {
        minWidth: 75,
      },
      dropDownContent: {
        alignItems: 'center',
        gap: 4,
        padding: '0 8px',
      },
      popover: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 4,
        boxSizing: 'border-box',
      },
    },
    variants: {
      buttons: createThemeVariant(ButtonTheme, {
        backgroundColor: menuItem.default.backgroundColor,
        activeBackgroundColor: menuItem.active.backgroundColor,
        textColor: menuItem.default.textColor,
        activeTextColor: menuItem.active.textColor,
        borderColor: menuItem.default.borderColor,
        activeBorderColor: menuItem.active.borderColor,
        alignment: 'left',
      }),
    }
  };
});

interface Props extends InternalFieldProps {
  value?: string | ReactListItem;
  values?: ReactListItem[];
  renderSelectedValue?(item?: ReactListItem): React.ReactNode;
  onChange?(id: string, item: ReactListItem): void;
}

export const DropDown = createComponent('DropDown', ({
  value: providedValue,
  values,
  renderSelectedValue,
  onChange,
  ...props
}: Props) => {
  const { css, variants, join } = useStyles();
  const value = useMemo(() => is.string(providedValue) ? values?.findById(providedValue) : is.listItem(providedValue) ? providedValue : undefined, [providedValue, values]);
  const anchorRef = useRef<HTMLElement | null>(null);
  const { target: resizeTarget, width } = useOnResize({ observeWidthOnly: true });
  const innerRef = useDOMRef([props.ref, anchorRef, resizeTarget]);
  const [isOpen, setIsOpen, setIsClosed] = useBooleanState(false);

  const renderItem = (item: ReactListItem) => (<>
    {item.iconName != null && <Icon name={item.iconName as any} size={'small'} />}
    {item.label ?? item.text}
  </>);

  const selectedValue = useMemo(() => {
    if (renderSelectedValue) return renderSelectedValue(value);
    return value != null ? renderItem(value) : null;
  }, [value, renderSelectedValue]);

  const handleItemClick = useBound((item: ReactListItem) => () => {
    item.onSelect?.();
    setIsClosed();
    onChange?.(item.id, item);
  });

  const renderedItems = useMemo(() => {
    if (!is.array(values)) return null;
    return values.map(item => {
      return (
        <Button key={item.id} onClick={handleItemClick(item)}>
          {renderItem(item)}
        </Button>
      );
    });
  }, [values]);

  const endAdornments = useMemo(() => [(
    <Button key="dropdown-open" onSelect={setIsOpen}>
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

  return (
    <InternalField
      {...props}
      tagName="dropdown"
      ref={innerRef}
      className={join(css.dropDown, props.className)}
      contentClassName={css.dropDownContent}
      endAdornments={endAdornments}
    >
      {selectedValue}
      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        PaperProps={paperProps}
        onClose={setIsClosed}
      >
        <ThemesProvider themes={join(variants.buttons)}>
          {renderedItems}
        </ThemesProvider>
      </Popover>
    </InternalField>
  );
});