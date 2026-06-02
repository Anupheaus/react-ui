import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';

interface Props {
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  startAdornments?: ReactNode;
  endAdornment?: ReactNode;
}

export function buildDatePickerAdornments({
  onNavigatePrevious,
  onNavigateNext,
  startAdornments,
  endAdornment,
  onOpenPicker,
}: Props & { onOpenPicker(): void }): { startAdornments: ReactNode; endAdornments: ReactNode } {
  const previousButton = onNavigatePrevious != null ? (
    <Button variant="hover" onSelect={onNavigatePrevious}>
      <Icon name="go-back" />
    </Button>
  ) : null;

  const nextButton = onNavigateNext != null ? (
    <Button variant="hover" onSelect={onNavigateNext}>
      <Icon name="sub-menu" />
    </Button>
  ) : null;

  return {
    startAdornments: (
      <>
        {previousButton}
        {startAdornments}
      </>
    ),
    endAdornments: (
      <>
        {nextButton}
        {endAdornment}
        <Button onSelect={onOpenPicker}>
          <Icon name="calendar" />
        </Button>
      </>
    ),
  };
}
