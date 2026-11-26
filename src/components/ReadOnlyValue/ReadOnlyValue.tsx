import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { UIState, useLocale } from '../../providers';
import type { PromiseMaybe} from '@anupheaus/common';
import { to } from '@anupheaus/common';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props is keyed by content hash so a new-but-equal props object does not recompute; formatCurrency is a stable bound function
  }, [value, Object.hash(props)]);

  return (
    <UIState isLoading={isLoading}>
      <Tag name="read-only-value">
        {formattedValue}
      </Tag>
    </UIState>
  );
});
