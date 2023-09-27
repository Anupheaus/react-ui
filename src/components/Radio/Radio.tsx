import { useMemo } from 'react';
import { useDistributedState } from '../../hooks';
import { ReactListItem } from '../../models';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { InternalField, InternalFieldProps } from '../InternalField';
import { RadioOption } from './RadioOption';

const useStyles = createStyles({
  radioGroupOptions: {
    padding: 4,
    margin: -4,
    marginLeft: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },
});

interface Props extends InternalFieldProps {
  isHorizontal?: boolean;
  value?: string;
  values?: ReactListItem[];
  onChange?(value: string): void;
}

export const Radio = createComponent('Radio', ({
  isHorizontal = false,
  values,
  value,
  onChange,
  ...props
}: Props) => {
  const { css } = useStyles();
  const { state, onChange: onSelectedChange } = useDistributedState(() => value, [value]);

  const renderedOptions = useMemo(() => (values ?? []).map(item => (
    <RadioOption key={item.id} item={item} state={state} />
  )), [values, state]);

  onSelectedChange((newId: string | undefined) => {
    if (newId != null) onChange?.(newId);
  });

  return (
    <InternalField tagName="radio-group" {...props} noContainer>
      <Flex tagName="radio-group-options" isVertical={!isHorizontal} align={'left'} disableGrow gap={isHorizontal ? 16 : 8} className={css.radioGroupOptions}>
        {renderedOptions}
      </Flex>
    </InternalField>
  );
});
