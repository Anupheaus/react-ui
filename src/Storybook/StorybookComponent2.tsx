import { createComponent } from '../components/Component';
import { createStyles } from '../theme/createStyles2';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { Tag } from '../components/Tag';

const useStyles = createStyles({
  component: {
    display: 'inline-flex',
    position: 'relative',
    flexDirection: 'column',
    gap: 12,
    width: 'min-content',
    flexGrow: 0,
    flexShrink: 1,
  },
  title: {
    display: 'flex',
    flex: 'none',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  borders: {
    position: 'relative',
    display: 'inline-flex',
    padding: 5,
    flexGrow: 0,
    flexShrink: 1,
    width: 'min-content',
    background: 'repeating-linear-gradient(45deg, black, black 10px, yellow 10px, yellow 20px)',
  },
  content: {
    position: 'relative',
    display: 'inline-flex',
    backgroundColor: 'white',
    flexGrow: 0,
    flexShrink: 1,
    width: 'min-content',
  }
});

interface Props {
  className?: string;
  title?: ReactNode;
  showComponentBorders?: boolean;
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}

export const StorybookComponent = createComponent('StorybookComponent', ({
  className,
  title,
  showComponentBorders = false,
  children,
  width,
  height,
}: Props) => {
  const { css, join } = useStyles();

  const style = useMemo<CSSProperties>(() => ({
    width,
    height,
  }), [width, height]);

  const withBorders = (content: ReactNode) => showComponentBorders === true ? (
    <Tag name='storybook-component-borders' className={css.borders}>
      {content}
    </Tag>
  ) : content;

  const withTitle = (content: ReactNode) => title != null ? (
    <>
      <Tag name="storybook-component-title" className={css.title}>{title}</Tag>
      {content}
    </>
  ) : content;

  return (
    <Tag name="storybook-component" className={css.component}>
      {withTitle(withBorders(
        <Tag name="storybook-content" className={join(css.content, className)} style={style}>{children}</Tag>))}
    </Tag>
  );
});