import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { Text } from '../Text';
import { createStyles } from '../../theme';

/** A message too long for one line of a phone. */
export const LONG_ERROR = 'This reason is far too long to fit on one line of a small phone, so it must wrap onto several lines '
  + 'inside the field rather than push the form wider than the screen.';
// One unbroken run (a pasted link or code) has nowhere to break, so it must wrap mid-word too
const LONG_UNBROKEN_HINT = 'https://example.com/a-very-long-link-pasted-into-the-notes-without-any-spaces-at-all';

// The phone is a size container, so the label measures against the phone's width as it would against a real screen's;
// the 16px gutter sits inside it, as a page's does inside the screen
const useStyles = createStyles({
  phone: {
    containerType: 'inline-size',
    overflow: 'auto',
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  // A box that shrinks to fit what is in it, as a toolbar or a chip row does
  shrinkToFit: {
    display: 'inline-flex',
  },
});

interface Props {
  /** The phone screen's width, in px. */
  width: number;
}

/**
 * Storybook only: one phone screen holding a form's column of fields with a long error and a long unbroken hint, then a
 * field with a long error in a box that shrinks to fit its content.
 */
export const AssistiveLabelPhoneForm = createComponent('AssistiveLabelPhoneForm', ({ width }: Props) => {
  const { css } = useStyles();
  return (
    <Tag name="phone-screen" className={css.phone} width={width}>
      <Tag name="phone-page" className={css.page}>
        <Text label="Reason" value="" error={LONG_ERROR} wide />
        <Text label="Link" value="" assistiveHelp={LONG_UNBROKEN_HINT} wide />
        <Tag name="shrink-to-fit" className={css.shrinkToFit}>
          <Text label="Notes" value="" error={LONG_ERROR} />
        </Tag>
      </Tag>
    </Tag>
  );
});
