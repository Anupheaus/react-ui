import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { UIState, useLocale } from '../../providers';
import { PromiseMaybe, to } from '@anupheaus/common';
import { useAsync } from '../../hooks';

interface NumberProps {
  type: 'number';
  value?: PromiseMaybe<number | undefined>;
  defaultValue?: number;
  decimalPlaces?: number;
}

interface CurrencyProps {
  type: 'currency';
  value?: PromiseMaybe<number | undefined>;
  defaultValue?: number;
}

type Props = NumberProps | CurrencyProps;

export const ReadOnlyValue = createComponent('ReadOnlyValue', (props: Props) => {
  const { formatCurrency } = useLocale();
  const { response: value, isLoading } = useAsync(() => props.value, [props.value]);

  const formattedValue = useMemo(() => {
    switch (props.type) {
      case 'currency': {
        const { defaultValue } = props;
        return formatCurrency(to.number(value, to.number(defaultValue, 0)));
      }
      case 'number': {
        const { defaultValue, decimalPlaces } = props;
        return Math.roundTo(to.number(value, to.number(defaultValue, 0)), decimalPlaces ?? 0).toString();
      }
      default: return value?.toString();
    }
  }, [value, Object.hash(props)]);

  return (
    <UIState isLoading={isLoading}>
      <Tag name="read-only-value">
        {formattedValue}
      </Tag>
    </UIState>
  );
});
