import { ReactNode } from 'react';
import { createStyles2 } from '../../theme';
import { createComponent } from '../Component';
import { useFormValidation } from '../Form';
import { Tag } from '../Tag';
import { Skeleton } from '../Skeleton';
import { useUIState } from '../../providers';

interface Props {
  className?: string;
  error?: ReactNode | Error;
  children?: ReactNode;
}

const useStyles = createStyles2(({ field: { default: defaultField, assistiveText }, error }) => ({
  assistiveLabel: {
    ...defaultField,
    ...assistiveText,
    cursor: 'default',
    width: 'max-content',
  },
  isError: {
    color: error.color,
  },
}));

export const AssistiveLabel = createComponent('AssistiveLabel', ({
  className,
  error,
  children = null,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();

  useFormValidation(
    () => error != null ? (error instanceof Error ? error.message : error) : null,
  );

  if (error != null) children = error instanceof Error ? error.message : error;

  return (
    <Tag
      name="assistive-label"
      className={join(
        css.assistiveLabel,
        error != null && css.isError,
        className,
      )}
    >
      <Skeleton type="text" isVisible={children != null && isLoading}>
        {children ?? <>&nbsp;</>}
      </Skeleton>
    </Tag>
  );
});
