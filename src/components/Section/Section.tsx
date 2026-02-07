import type { ReactNode } from 'react';
import { createComponent } from '../Component';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';

const useStyles = createStyles(({ fields: { content: { normal: { borderColor } } } }) => ({
  section: {
    position: 'relative',
    padding: '24px 8px 8px',
  },
  sectionBorder: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor,
    borderRadius: 4,
    clipPath: 'shape(from 0 0, line to 8px 0, line to 8px 12px, line to calc(100% - 8px) 12px, line to calc(100% - 8px) 0, line to 100% 0, line to 100% 100%, line to 0 100%, close)',

    '&.no-clip': {
      clipPath: 'none',
    },
  },
  sectionLabel: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 8,
  },
  sectionLabelBorder: {
    marginTop: 8,
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor,
    height: 1,
  },
}));

interface Props extends Pick<FlexProps, 'className' | 'children' | 'gap' | 'disableGrow' | 'isVertical' | 'wide' | 'maxHeight'> {
  label?: ReactNode;
}

export const Section = createComponent('Section', ({
  label,
  maxHeight,
  ...props
}: Props) => {
  const { css, join } = useStyles();

  return (
    <Flex tagName="section" className={css.section} maxHeight={maxHeight}>
      <Flex tagName="section-border" className={join(css.sectionBorder, label == null && 'no-clip')} />
      {label != null && (
        <Flex tagName="section-label" className={css.sectionLabel} gap={8}>
          {label}
          <Flex tagName="section-label-border" className={css.sectionLabelBorder} />
        </Flex>
      )}
      <Flex tagName="section-contents" {...props} />
    </Flex>
  );
});